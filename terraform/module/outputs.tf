output "vpc_id" {
  description = "ID of the VPC created by the VPC module"
  value       = module.main_vpc.vpc_id
}

output "eks_cluster_name" {
  description = "Name of the EKS cluster"
  value       = aws_eks_cluster.this.name
}

output "eks_cluster_endpoint" {
  description = "Kubernetes API endpoint for the EKS cluster"
  value       = aws_eks_cluster.this.endpoint
}

output "aws_region" {
  description = "AWS region hosting the cluster"
  value       = var.aws_region
}