from channels.layers import get_channel_layer
from django.http import HttpResponse
from asgiref.sync import async_to_sync
from testamp.celery_tasks import evaluate_edited_test_amp_file


def debug(request):
    evaluate_edited_test_amp_file.delay(32, 4, 1)
    return HttpResponse('TESTR')


def ws_test(request):
    layer = get_channel_layer()
    async_to_sync(layer.group_send)(f'user_{1}', {
        'type': 'event_notify',
        'content': {
            'complex': 'json_test',
            'comples': {
                'very': 'complex'
            }
        }
    })

    return HttpResponse('WS TEST')
