# wonderlic/docker-ebs-sidekick

##### github repo: wonderlic/docker-ebs-sidekick

This docker image will attach an Amazon EBS Volume to an Amazon EC2 Instance.
It will then wait for a SIGINT or SIGTERM signal, at which point it will detach the Amazon EBS Volume.
This is meant to be used on a CoreOS cluster as a sidekick to another container that needs persistent storage.


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
