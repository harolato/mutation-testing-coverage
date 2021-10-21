from rest_framework import serializers

from job.models import Job, File, Mutation


class FileSerializer(serializers.ModelSerializer):
    mutations = serializers.HyperlinkedIdentityField(view_name='api:mutation-detail', many=True, read_only=True)

    class Meta:
        model = File
        exclude = ()


class MutationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mutation
        exclude = ()


# class JobFileSerializer(serializers.ModelSerializer):
#     href =
#
#     class Meta:
#         model = File
#         exclude = ()


class JobSerializer(serializers.ModelSerializer):
    files = serializers.HyperlinkedIdentityField(view_name='api:file-detail', many=True, read_only=True)

    class Meta:
        model = Job
        exclude = ()
