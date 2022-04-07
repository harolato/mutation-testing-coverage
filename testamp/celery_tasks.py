import functools
import os
import re
import time
import uuid
import zipfile
from contextlib import suppress
from io import BytesIO
from operator import itemgetter
from typing import List

import requests
from asgiref.sync import async_to_sync
from celery.app import shared_task
from channels.layers import get_channel_layer
from django.contrib.auth.models import User
from github import Github, GithubIntegration
from github.WorkflowRun import WorkflowRun

from job.models import Project
from testamp.models import TestCase


@shared_task
def evaluate_edited_test_amp_file(test_case_id: int, project_id: int, user_id: int):
    git_integration = GithubIntegration(integration_id=os.environ.get('GH_BOT_ID'),
                                        private_key=os.environ.get('GH_BOT_PK'))
    try:
        user: User = User.objects.get(pk=user_id)
        layer = get_channel_layer()

        test_case = TestCase.objects.get(pk=test_case_id)

        project: Project = Project.objects.get(pk=project_id)
        gh_repo_path = f'{project.git_repo_owner}/{project.git_repo_name}'
        installation = git_integration.get_installation(project.git_repo_owner, project.git_repo_name)
        access_token = git_integration.get_access_token(installation_id=installation.id)
        gh = Github(login_or_token=access_token.token)

        run_id = uuid.uuid4()

        test_case.evaluation_workflow_uuid = run_id
        test_case.save()

        gh.get_repo(gh_repo_path).get_workflow('mutalkCI.yml').create_dispatch(ref='master', inputs={
            'id': str(run_id)
        })

        async_to_sync(layer.group_send)(f'user_{user_id}', {
            'type': 'event_notify',
            'content': {
                'type': 'evaluation',
                'status': 'Task initiated... waiting for ID',
                'data': {
                    'task_UID': str(run_id),
                    'gh': [gh_repo_path, installation.id]
                },
                'timestamp': time.time()
            }
        })

        attempts = 20
        workflow_run_id = None
        while not workflow_run_id:
            workflows: List[WorkflowRun] = gh.get_repo(gh_repo_path) \
                .get_workflow_runs(actor='testamp-testing-bot', event='workflow_dispatch') \
                .get_page(0)
            for workflow in workflows:
                jobs = requests.get(workflow.jobs_url, headers={
                    'Authorization': f'token {access_token.token}'
                }).json()
                for job in jobs['jobs']:
                    for step in job['steps']:
                        job_step_name = step['name']
                        if job_step_name == str(run_id):
                            workflow_run_id = int(workflow.id)
                            break
            attempts -= 1

        if attempts <= 0:
            raise Exception('Attempts exceeded. Try again.')

        test_case.evaluation_workflow_data['workflow_run_id'] = workflow_run_id

        async_to_sync(layer.group_send)(f'user_{user_id}', {
            'type': 'event_notify',
            'content': {
                'type': 'evaluation',
                'status': 'Evaluation workflow is running...',
                'data': {
                    'workflow_run_id': workflow_run_id,
                    'task_UID': str(run_id),
                    'gh': [gh_repo_path, installation.id],
                    'attempts_remaining': attempts
                },
                'timestamp': time.time()
            }
        })

        complete = False
        timeout = 60 * 20  # 20 minutes
        start_time = time.time()
        update_frequency = 5  # 5 seconds
        last_update = time.time()
        while not complete and workflow_run_id:
            workflow: WorkflowRun = gh.get_repo(gh_repo_path).get_workflow_run(workflow_run_id)
            if workflow.status == 'completed':
                complete = True

            elapsed = time.time() - start_time
            update_frequency_elapsed = time.time() - last_update
            if update_frequency_elapsed > update_frequency:
                last_update = time.time()
                async_to_sync(layer.group_send)(f'user_{user_id}', {
                    'type': 'event_notify',
                    'content': {
                        'type': 'evaluation',
                        'status': f'Evaluation workflow is running... time elapsed: {elapsed}s.',
                        'data': {
                            'workflow_run_id': workflow_run_id,
                            'task_UID': str(run_id),
                        },
                        'timestamp': time.time()
                    }
                })
            if elapsed > timeout:
                raise Exception('Evaluation time-out (20minutes). Contact admin or try again.')

        test_case.evaluation_workflow_data['success'] = False if workflow.conclusion.lower() != 'success' else True

        async_to_sync(layer.group_send)(f'user_{user_id}', {
            'type': 'event_notify',
            'content': {
                'type': 'evaluation',
                'status': 'Evaluation has been completed',
                'data': {
                    'success': test_case.evaluation_workflow_data['success'],
                    'workflow_run_id': workflow_run_id,
                    'task_UID': str(run_id),
                    'gh': [gh_repo_path, installation.id],
                    'attempts_remaining': attempts
                },
                'timestamp': time.time()
            }
        })
        test_case.save()

    except Exception as e:
        async_to_sync(layer.group_send)(f'user_{user_id}', {
            'type': 'event_notify',
            'content': {
                'type': 'evaluation',
                'status': 'Error has occurred',
                'data': {
                    'error_message': str(e),
                    'error': True
                },
                'timestamp': time.time()
            }
        })
    return True
