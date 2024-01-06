---
title: 'Why Terraform?'
date: 2019-12-25T07:39:00.000-08:00
summary: Terraform leads the way in the infrastructure-as-code world...
categories:
  - Blog
  - Software-Infrastructure
draft: false
---

Terraform leads the way in the infrastructure-as-code world; I've been using it exclusively for my personal projects and wherever I can at work. It provides peace of mind during deployments, stabilizes build pipelines, and helps speed up my adoption of cloud infrastructure. It's no silver bullet, but it's an excellent tool that solves an increasingly complex problem.

### History of the Problem

In traditional applications and old-school organizations, there are extreme difficulties managing on-premise infrastructure:  

1.  Costly hardware installations, operations, and training
2.  Slow reaction to scaling needs
3.  Wasted extra capacity
4.  Manual configuration
5.  Fixed ops team resources
6.  Tickets submitted in a queue means long wait times to make changes

The first 3 are problems that cloud infrastructure and IaaS has been solving for years now. Most modern companies are leveraging the power of cloud providers to fulfill much of their infrastructure needs nowadays. But cloud services don't solve issues #4, 5, or 6 so companies still struggle with:  

*   Difficulty scheduling infrastructure changes alongside application changes
*   Sluggish reaction time when things go wrong
*   Overhead managing ops teams

Additionally, increasing adoption of microservices and serverless introduces new complexities:  

*   Many small, incremental deployments
*   Polyglot data
*   Highly abstracted infrastructure
*   Cloud vendor lock-in

#### Enter Infrastructure as Code

Infrastructure as code tools help organizations address these issues head-on by encoding all infrastructure changes as human-readable code in a consistent way. This provides the benefits of:

*   Efficient and predictable deployments
*   Change tracking
*   Automation
*   Robust disaster recovery
*   Ease of creating and destroying infrastructure
*   Enabling self-service

[Hashicorp's Terraform](https://www.terraform.io/) has quickly become the industry standard solution. It not only provides the previous benefits, but also helps fight against vendor lock-in by supporting a huge number of providers with the ability to write your own.  

### Example

[https://github.com/benjohns1/terraform-example](https://github.com/benjohns1/terraform-example)

  

In the example above, there's a tiny serverless application written in Go that runs on AWS Lambda and API Gateway. It can be built locally from the app/build directory. For deployment, Terraform configurations in the app/deploy define the application zip file to upload to AWS Lambda, and some basic settings for the API Gateway.  
  
The Terraform module in module/aws-serverless-app generically describes what infrastructure is needed in AWS to expose a lambda function behind an API. The app uses this module and passes the specific parameters for itself.  
  
This modular architecture allows us to encapsulate and reuse portions of our infrastructure code. You can imagine multiple apps that provide different business functionality, but all run on lambda behind an API gateway; the aws-serverless-app module could be reused to deploy all of them.  
  
This example was derived directly from Yevgeniy Brikman's excellent talk on [Automated Testing for Terraform, Docker, Packer, Kubernetes, and More](https://www.youtube.com/watch?v=xhHOW0EF5u8)  

*   [https://github.com/gruntwork-io/infrastructure-as-code-testing-talk](https://github.com/gruntwork-io/infrastructure-as-code-testing-talk)
