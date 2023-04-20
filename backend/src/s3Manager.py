import boto3
import requests
import json
import os

class S3Manager():
    def __init__(self):
        # connect to s3 'blooms-app' bucket
        self.s3 = boto3.resource('s3', aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"), aws_secret_access_key=os.getenv("AWS_ACCESS_KEY_SECRET"))
        self.bucket_name = 'pdexam'
        self.bucket = self.s3.Bucket(self.bucket_name)

    def upload_file(self, source_file, destination_file):
        self.bucket.upload_file(source_file, destination_file, ExtraArgs={'ACL': 'public-read'})
        return f'https://{self.bucket_name}.s3.amazonaws.com/{destination_file}'

    def download_file(self, source_file, destination_file):
        self.bucket.download_file(source_file, destination_file)

    def delete_file(self, file):
        self.bucket.delete_objects(Delete={'Objects': [{'Key': file}]})

    def read_json_file(self, file):
        obj = self.s3.Object(self.bucket_name, file)
        body = obj.get()['Body'].read()

        return json.loads(body)