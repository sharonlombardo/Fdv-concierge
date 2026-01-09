# CLAUDE.md - AI Assistant Guide for Fdv-concierge

This document provides context and guidelines for AI assistants working with the Fdv-concierge codebase.

## Project Overview

**Repository:** Fdv-concierge
**Status:** Initial development phase
**Primary Language:** TBD (to be established as development begins)

This repository is in its early stages. This document will be updated as the project architecture and conventions are established.

## Repository Structure

```
Fdv-concierge-/
├── README.md           # Project description and setup instructions
├── CLAUDE.md           # This file - AI assistant guidelines
└── .git/               # Git version control
```

*Note: Structure will be updated as the project develops.*

## Development Workflow

### Branch Naming Convention

- Feature branches: `feature/<description>`
- Bug fixes: `fix/<description>`
- Documentation: `docs/<description>`
- Claude AI branches: `claude/<description>-<session-id>`

### Commit Message Guidelines

Follow conventional commit format:
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Example: `feat: add user authentication module`

### Pull Request Process

1. Create a feature branch from main
2. Make changes and commit with descriptive messages
3. Push to remote and create a pull request
4. Ensure all checks pass before merging

## Code Style Guidelines

### General Principles

- Write clean, readable, and maintainable code
- Follow the principle of least surprise
- Keep functions small and focused on a single responsibility
- Use meaningful variable and function names
- Add comments only when the code isn't self-explanatory

### Documentation

- All public APIs should be documented
- README should include setup instructions
- Update CLAUDE.md when adding new conventions or architecture changes

## Testing

*Testing framework and conventions to be established.*

Guidelines to follow:
- Write tests for new features
- Maintain existing test coverage
- Run tests before committing

## Build and Run Commands

*Commands to be added as the project develops.*

Placeholder structure:
```bash
# Install dependencies
# npm install / pip install -r requirements.txt / etc.

# Run development server
# npm run dev / python manage.py runserver / etc.

# Run tests
# npm test / pytest / etc.

# Build for production
# npm run build / etc.

# Linting
# npm run lint / flake8 / etc.
```

## Environment Setup

*Environment configuration to be documented as established.*

Typical considerations:
- Required runtime versions
- Environment variables (document in `.env.example`)
- External service dependencies

## Key Conventions for AI Assistants

### When Working on This Codebase

1. **Read before modifying** - Always read and understand existing code before making changes
2. **Minimal changes** - Make only the changes necessary to accomplish the task
3. **No over-engineering** - Avoid adding unnecessary abstractions or features
4. **Preserve existing style** - Match the code style of existing files
5. **Update documentation** - Keep README and CLAUDE.md current with changes

### Security Considerations

- Never commit secrets, API keys, or credentials
- Validate all external inputs
- Use parameterized queries for database operations
- Follow OWASP security guidelines

### What to Avoid

- Don't add features beyond what's requested
- Don't refactor code unnecessarily
- Don't add comments to code you didn't write
- Don't create new files unless absolutely necessary
- Don't guess at missing configuration - ask for clarification

## Architecture Decisions

*Architecture Decision Records (ADRs) to be added as decisions are made.*

Format for new ADRs:
```
### ADR-XXX: Title

**Date:** YYYY-MM-DD
**Status:** Proposed/Accepted/Deprecated
**Context:** Why this decision is needed
**Decision:** What was decided
**Consequences:** Impact of the decision
```

## Dependencies

*Dependencies to be documented as they are added.*

## External Services

*External service integrations to be documented as they are configured.*

## Troubleshooting

*Common issues and solutions to be documented as they are discovered.*

---

## Changelog

| Date | Author | Changes |
|------|--------|---------|
| 2026-01-09 | Claude AI | Initial CLAUDE.md creation |

---

*This document is maintained to help AI assistants understand and work effectively with the Fdv-concierge codebase. Update it whenever significant changes are made to the project structure, conventions, or workflows.*
