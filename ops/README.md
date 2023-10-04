# Netlify Ops

## Terraform

The infrastructure is defined using Terraform, a tool for building, changing,
and versioning infrastructure safely and efficiently.

### prod.tf

The code defines the required provider for AWS and sets up the backend for
storing the Terraform state file in an S3 bucket.

It also defines a Route53 zone for the domain "airnote.live" and creates three
Route53 records:

1. An A record for the root domain "airnote.live" that points to the IP address
   "75.2.60.5".
2. A CNAME record for the subdomain "start.airnote.live" that points to the
   domain "airnote-live.netlify.app".
3. A CNAME record for the subdomain "www.airnote.live" that points to the domain
   "airnote-live.netlify.app".

### Once ever

(Carl already did this)

- Manually create the S3 bucket (private and versioned) for storing the
  Terraform state.

### Once on your machine

Install terraform 1.4.6 from the terraform website. (Simple portable binary, no 'install' needed)

```bash
aws configure --profile blues-prod # set up aws creds blues-prod
```

### After each change of the Terraform code

To apply the Terraform code, run the following commands:

```bash
terraform init
terraform apply
```
