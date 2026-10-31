module "main_vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "6.7.3"

  name = "my-vpc"
  cidr = "10.0.0.0/16"

  azs             = var.vpc_availability_zones
  private_subnets = var.vpc_private_subnets
  public_subnets  = var.vpc_public_subnets

  # Share one NAT Gateway across both AZs to keep this personal project cheaper.
  enable_nat_gateway = true
  single_nat_gateway = true

  tags = {
    Terraform   = "true"
    Environment = var.environment
  }

  public_subnet_tags = {
    "kubernetes.io/role/elb" = "1"
  }

  private_subnet_tags = {
    "kubernetes.io/role/internal-elb" = "1"
  }
}