from rest_framework import serializers

from job.models import Job, File, Mutation


class MutationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mutation
        exclude = ()
        read_only_fields = ('file',)


class FileSerializer(serializers.ModelSerializer):
    mutations = MutationSerializer(many=True, read_only=False)

    class Meta:
        model = File
        exclude = ()


# class JobFileSerializer(serializers.ModelSerializer):
#     href =
#
#     class Meta:
#         model = File
#         exclude = ()


class JobSerializer(serializers.ModelSerializer):
    files = FileSerializer(many=True, read_only=False)

    def create(self, validated_data):
        token = self.context['request'].auth
        project = token.project
        validated_data['project'] = project
        files_data = validated_data.pop('files')
        job = Job.objects.create(**validated_data)
        for file in files_data:
            mutations = file.pop('mutations')
            new_file = File.objects.create(job=job, **file)
            for mutation in mutations:
                new_mutation = Mutation.objects.create(file=new_file, **mutation)
                new_file.mutations.add(new_mutation)
            job.files.add(new_file)
        return job

    class Meta:
        model = Job
        exclude = ()
