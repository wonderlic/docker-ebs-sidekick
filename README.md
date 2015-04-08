# wonderlic/ebs-sidekick

### Links

* github: [https://github.com/wonderlic/docker-ebs-sidekick](https://github.com/wonderlic/docker-ebs-sidekick)
* docker hub: [https://registry.hub.docker.com/u/wonderlic/ebs-sidekick/](https://registry.hub.docker.com/u/wonderlic/ebs-sidekick/)

### Description

This docker image will attach an Amazon EBS Volume to an Amazon EC2 Instance.
It will then wait for a SIGINT or SIGTERM signal, at which point it will detach the Amazon EBS Volume.
This is meant to be used on a CoreOS cluster as a sidekick to another container that needs persistent storage.

### Docker Image Size

```
wonderlic/ebs-sidekick:latest  - 20.13 MB
```

### Usage

```
docker run \
  -e AWS_ACCESS_KEY_ID=... \
  -e AWS_SECRET_ACCESS_KEY=... \
  -e AWS_DEFAULT_REGION=... \
  -e VOLUME_ID=... \
  -e INSTANCE_ID=... \
  -e DEVICE=... \
  wonderlic/ebs-sidekick
```

INSTANCE_ID is optional.  If not supplied, the code will attempt to look up the instance-id of the Amazon EC2 instance that it is running on using the local meta-data service.

### Example IAM Policy

```
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ec2:DescribeVolumes"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "ec2:AttachVolume",
        "ec2:DetachVolume"
      ],
      "Resource": "arn:aws:ec2:[REGION]:[ACCOUNT]:instance/*",
      "Condition": { "StringEquals": {"ec2:ResourceTag/Name": "[INSTANCE_NAME_TAG]"}}
    },
    {
      "Effect": "Allow",
      "Action": [
        "ec2:AttachVolume",
        "ec2:DetachVolume"
      ],
      "Resource": "arn:aws:ec2:[REGION]:[ACCOUNT]:volume/*",
      "Condition": { "StringEquals": {"ec2:ResourceTag/Name": "[VOLUME_NAME_TAG]"}}
    }
  ]
}
```

Replace [REGION], [ACCOUNT], [INSTANCE_NAME_TAG] and [VOLUME_NAME_TAG] with the appropriate values for your environment.
