resource "aws_eks_fargate_profile" "app" {
  cluster_name           = aws_eks_cluster.this.name
  fargate_profile_name   = "${var.cluster_name}-app"
  pod_execution_role_arn = aws_iam_role.fargate_pod_execution.arn
  subnet_ids             = module.main_vpc.private_subnets

  selector {
    namespace = var.app_namespace
  }

  depends_on = [
    aws_iam_role_policy_attachment.fargate_pod_execution
  ]

  tags = {
    Environment = var.environment
    Terraform   = "true"
  }
}

resource "aws_eks_fargate_profile" "coredns" {
  cluster_name           = aws_eks_cluster.this.name
  fargate_profile_name   = "${var.cluster_name}-coredns"
  pod_execution_role_arn = aws_iam_role.fargate_pod_execution.arn
  subnet_ids             = module.main_vpc.private_subnets

  selector {
    namespace = "kube-system"

    labels = {
      "k8s-app" = "kube-dns"
    }
  }

  depends_on = [
    aws_iam_role_policy_attachment.fargate_pod_execution
  ]

  tags = {
    Environment = var.environment
    Terraform   = "true"
  }
}