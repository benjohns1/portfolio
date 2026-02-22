---
title: 'Steward Agents - Agentic DDD'
date: 2026-02-22T13:43:00.000-06:00
summary: Leverage Steward Agents and Domain-Driven Design to maintain distributed systems
categories:
  - Blog
  - Software-Architecture
draft: false
---

# Steward Agents - Agentic DDD

One of the difficulties managing distributed systems is maintaining consistency across discrete components. Whether the system is a microservice, monolithic, or blended architecture, if parts of it are maintained by different teams, those teams make different decisions due to differing experiences, constraints, technology choices, and interpretations. Processes like standardized documentation, NFRs, ADRs, architectural reviews, cross-cutting meetings, and guilds can help with this, but as teams grow and the system gets more complex, communication gets exponentially more expensive and more is lost in translation.

With LLM models getting significantly better at software engineering alongside the proliferation of agentic workflows, an interesting opportunity arises to blend ideas from Domain-Driven Design (DDD), Team Topologies, and agent workflows. If the components of the system are aligned with a business sub-domain into bounded contexts, why not create an agent that is responsible for that bounded context?

## Steward Agents

A Steward Agent's purpose is to deeply understand its portion of the business domain, the technical implementation, the contracts it exposes to others, and the status of its operation. One of the primary benefits of bounded contexts in DDD is that they constrain the solution to a smaller portion of the larger business context; it is a natural boundary for human teams to become experts in, so too for Steward Agents.

Coding agents nowadays require reading large swathes of the codebase to understand the implementation details in order to be effective. They have to re-discover the boundaries, complexities, and quirks of the codebase for each task. If a codebase is architected with bounded contexts, it inherently makes it easier for any coding agent to reason about the system. If a Steward Agent is built to deeply understand one area of the system, maintain its own long-term documentation, ADRs, and reference centralized guidance on coding standards, it can become a resource that other humans and agents can leverage more efficiently than a generalized agent.

## Architect Agents

Just as it is important for software engineers to use systems-thinking to understand how their current effort fits into the big picture, it is important for Steward Agents to understand how their bounded context fits into the broader system to avoid overoptimizing nonessential functionality. This can be solved by maintaining the documentation for a bounded context map that all Steward Agents have access to. As this higher-level documentation becomes harder to manage, an Architect Agent can be created whose responsibility is to maintain a zoomed-out understanding of the full system business context and how each bounded context fits into the whole:

```
Business Domain - System Level Context Map - Architect Agent
 └─ Subdomain A - Bounded Context - Steward Agent
 └─ Subdomain B - Bounded Context - Steward Agent
 └─ Subdomain C - Bounded Context - Steward Agent
```

## Bounded Contexts and Context Windows

Even though the word "context" in "bounded context" and "context window" comes from different technical roots, their definitions converge. Protecting the agent's context window from being filled up by complexity from other bounded contexts is critical. Without this you lose the benefits of Steward Agents. Their purpose is to focus only on the details within their bounded context and it interface to the rest of the system. 

## Agent Capabilities and Rollout

Rolling out Steward Agents can be a simple experiment, initially. They can be enhanced over time to unlock more capabilities and offload more responsibility from human teams. Even if your system is not modular and needs to be significantly refactored, you can still start designing with Steward Agents to maintain documentation and help guide the refactoring process.

Multiple Steward Agents can be used in a single bounded context, each with shared access to domain knowledge, but with individual responsibilities and roles.

Agent types:
- Architect - Responsible for the high-level system solution
- Steward - Responsible for a single bounded context
	- Code - Writes code and documentation
	- Review - Critically reviews code, comments on PRs
	- Operation - Monitors health, logs, & metrics
	- Quality - Critically reviews and tests code
	- Project - Manages task backlog

### Detailed Code Review

A Review Steward could be notified when a PR is opened for code inside its bounded context and make a more informed code review than a generalist code reviewer agent.

### Quality Control

As code is changed, a Quality Steward can review and notify engineers if documentation is invalid, quality standards, best-practices, compliance regulations, security practices, or NFRs are not met. As these notifications are tuned, the agent can start recommending specific tasks and changes which will be more relevant than a generalist agent, due to its increased domain knowledge.

### Monitoring

The Operation Steward can be enhanced with the ability to monitor production and keep track of its operations, surfacing any issues as bug tickets or notifications.

### Coding & Documentation

When making small changes within a single bounded context, engineers can interact with the Code Steward directly to implement those changes. It already has the understanding and tools necessary to make changes correctly and efficiently.

The Code Steward is responsible for maintaining bounded context-specific documentation and ADRs.

### Self-Maintenance

After quality control and coding capabilities are incorporated, the next step is to allow the Steward agents to make their own PRs based on accumulated tech debt or bugs they find. Any changes should be isolated within the bounded context, and it should not be allowed to modify any external contracts.

A Project Steward can keep track of tickets flagged for automatic maintenance (which also may be tickets reported by the Operation and Quality Stewards) and delegate them to the Code Steward for implementation.

### Project Coordination

For larger system-wide changes, a Steward Agent can be enhanced to work as a sub-agent or collaborator with other agents when directed by an Architect Agent. This requires a more complex orchestration setup to enable this, but once it is set up, an engineer can start by interacting with an Architect Agent to define the broader solution, then work with individual Steward Agents on the implementation details within their bounded context.

Expand-contract pattern and deployment coordination may need to be taken into account when changes are being applied across distributed components.

## Agent Interactions

### Implementation Collaboration

This is a standard collaboration between an engineer and agents to implement code changes.

```
Software Engineer collaborates with
 └─> Architect creates high-level plan and delegates to
      └─> Code Steward (bounded context A) creates plan and implements code
      └─> Code Steward (bounded context B) creates plan and implements code
```

### Trigger Orchestration

Steward Agents can automatically monitor and maintain their own bounded context. Certain activities could be prioritized over others, depending on current token budget and spend.

```
Code changed
 └─> Quality Steward notifies or logs ticket if possible issues found
```

```
PR opened
 └─> Review Steward reviews proposed changes and comments on PR
```

```
PR comment made
 └─> Code Steward reads comments, replies, and makes changes to PR
```

```
System alert
 └─> Operation Steward inspects and logs ticket
```

```
Schedule
 └─> Operation Steward inspects system health and logs ticket if issues found
 └─> Project Steward inspects ticket backlog and picks a priority item
      └─> Code Steward creates plan, implements code, and makes a PR
```

### Project Collaboration and Orchestration

This is an advanced collaboration with an engineer to define a large-scale project to be automatically implemented by agents without direct collaboration during coding. The collaboration flow is the same as standard coding with engineer/agent collaboration above, but the output of the collaboration is a set of tickets that the system will implement autonomously, instead of working code.

```
Software Engineer collaborates with
 └─> Architect creates high-level plan and delegates to
      └─> Project Steward (bounded context A) creates plan and logs tickets
      └─> Project Steward (bounded context B) creates plan and logs tickets

Project ready (bounded context A)
 └─> Project Steward picks a priority item
      └─> Code Steward implements code and makes a PR
 └─> ... until project is done

Project ready (bounded context B)
 └─> Project Steward picks a priority item
      └─> Code Steward implements code and makes a PR
 └─> ... until project is done
```
