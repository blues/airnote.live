terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
  backend "s3" {
    bucket  = "airnote-live-terraform-state"
    key     = "airnote-live-state"
    region  = "us-east-1"
    encrypt = true
    profile = "blues-prod"
  }
}

provider "aws" {
  alias   = "prod"
  region  = "us-east-1"
  profile = "blues-prod"
}

data "aws_route53_zone" "airnote-live" {
  provider     = aws.prod
  name         = "airnote.live"
}

resource "aws_route53_record" "a_airnote_live" {
  provider = aws.prod
  name    = "airnote.live"
  type    = "A"
  records = ["75.2.60.5"]
  ttl     = 300
  zone_id = data.aws_route53_zone.airnote-live.zone_id
}

resource "aws_route53_record" "cname_start_airnote_live" {
  provider = aws.prod
  name    = "start.airnote.live"
  type    = "CNAME"
  records = ["airnote-live.netlify.app"]
  ttl     = 300
  zone_id = data.aws_route53_zone.airnote-live.zone_id
}

resource "aws_route53_record" "cname_www_airnote_live" {
  provider = aws.prod
  name    = "www.airnote.live"
  type    = "CNAME"
  records = ["airnote-live.netlify.app"]
  ttl     = 300
  zone_id = data.aws_route53_zone.airnote-live.zone_id
}
