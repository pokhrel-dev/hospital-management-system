                                                            Healthcare Management Portal (HMP)

🏥 Executive Summary

The Healthcare Management Portal is an enterprise-grade full-stack monorepo designed for high-integrity healthcare data and patient management. It leverages a modern React-Django-PostgreSQL stack, fully containerized with Docker and governed by a rigorous GitHub Actions CI/CD pipeline.

🏗 System ArchitectureThe following diagram illustrates the functional separation of the HMP ecosystem, highlighting the interaction between decoupled services and the persistence layer.

Infrastructure & DevOps: Managed via Docker Compose for local orchestration and GitHub Actions for automated cloud verification.

Frontend (React): Component-driven UI utilizing React 18, featuring role-based dashboards for Doctors and Patients.

Backend (Django): Python 3.13 REST API handling JWT authentication, migrations, and business logic.

Persistence Layer: PostgreSQL 15 ensures relational data integrity for all healthcare records.

🛠 Core Tech Stack

Component,                      Technology Stack

Backend,Python 3.13 / Django / REST Framework
Frontend,React 18 / Node 18
Database,PostgreSQL 15
Infrastructure,Docker & GitHub Actions


ComponentTechnology StackBackendPython 3.13 / Django / REST FrameworkFrontendReact 18 / Node 18DatabasePostgreSQL 15InfrastructureDocker & GitHub Actions
🚦 CI/CD & Development StandardsThis repository enforces strict Continuous Integration to maintain professional-grade stability:Automated Gatekeeping: Every Pull Request (PR) triggers an automated build that verifies database migrations and React production builds.Branch Protection: Direct pushes to master are restricted; code must pass the Integrity Audit via the CI/CD pipeline before merging.Zero-Warning Policy: Builds are configured to treat warnings as errors to ensure maximum code quality.🚀 Local ExecutionPowerShell# 1. Clone the repository
git clone https://github.com/pokhrel-dev/healthcare-management-portal.git

# 2. Initialize Infrastructure
docker-compose up --build

# 3. Apply Schema Migrations
cd backend/core
python manage.py migrate
🗺 RoadmapRole-Based Access: Specialized dashboards for Medical Staff and Patients.Automated Testing: PyTest integration for backend logic and Jest for UI components.Data Engineering: Expansion of Silver/Platinum data layers for advanced analytics.