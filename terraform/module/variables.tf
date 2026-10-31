// Environment
variable "environment" {
  type        = string
  description = "Environment for this project"
  default     = "Development"
}

variable "aws_region" {
  type        = string
  description = "AWS region; must match the region containing the configured Availability Zones"
  default     = "eu-west-1"
}

variable "cluster_name" {
  type        = string
  description = "Name of the EKS cluster"
  default     = "mern-personal-eks"
}

variable "cluster_endpoint_public_access_cidrs" {
  type        = list(string)
  description = "CIDR blocks allowed to reach the public EKS Kubernetes API endpoint; set this to your public IP with /32"
}

variable "app_namespace" {
  type        = string
  description = "Kubernetes namespace selected by the application Fargate profile"
  default     = "mern-app"
}

// VPC variables
variable "vpc_availability_zones" {
  type        = list(string)
  description = "Availability zones for VPC module"
  default     = ["eu-west-1a", "eu-west-1b"]
}

variable "vpc_public_subnets" {
  type        = list(string)
  description = "Public subnets for VPC module; one per configured AZ"
  default     = ["10.0.101.0/24", "10.0.102.0/24"]
}

variable "vpc_private_subnets" {
  type        = list(string)
  description = "Private subnets for VPC module; one per configured AZ"
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}