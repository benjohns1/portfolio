---
title: 'Composable Units in Agentic Engineering'
date: 2026-03-21T18:58:00.000-06:00
summary: Guardrails around bounded contexts to wrangle agentic complexity
categories:
  - Blog
  - Software-Architecture
draft: false
---

# Composable Units in Agentic Engineering

One of the difficulties engineers face at the moment is figuring out how to get deterministic results from a system where we no longer write the deterministic code. Interestingly enough, this is very similar to the difficulty that system architects have had for decades, ever since large software systems started being built. The only difference is how we think about the smallest unit of composable work: only now it is a changeset made by an agent instead of a human.

That means we have tools at our disposal to help wrangle this complexity. Techniques like domain-driven design (DDD), test-driven development (TDD), contract testing, and spec-driven development were all invented to provide structural guardrails in a large system built by many non-deterministic beings writing code. I'm slowly coming to terms with the fact that the future is not in human beings reviewing or even *understanding* the code itself, but instead having the agentic guardrails in place to ensure the code adheres to strict rules around side effects, security, architectural standards, and API contracts. This way we can understand and verify the *behavior* of the system as we move farther away from its actual implementation.

The biggest difference is that previously, *somebody* actually did understand the inner workings of each component in the system. With agents, we don't have that guarantee anymore, so we need to ensure we're capturing relevant design decisions and domain knowledge as the system is built. Agents are gaining more tools, memory, and scheduling autonomy, but we also need additional state to be persistently maintained inside our *components* to give agents the relevant "why" context that cannot be gleaned from just reading the code. We need to encode and maintain tribal knowledge into the system itself.

## Zoom Levels

What are the architectural boundaries that can help isolate this knowledge? In DDD, a bounded context is a solution boundary that solves the needs of a particular sub-domain of the business. We can create architectural guardrails enforcing bounded-context architecture and design them to maintain their own ubiquitous language, domain  knowledge, and coding patterns. These guardrails should exist at multiple zoom levels and include a combination of deterministic scripts that enforce strict rules and non-deterministic guidance for agents.

1. **System Architecture:** This level is responsible for enforcing boundaries, dependencies, and relationships between bounded contexts, the overarching business domain, and the overarching rules of the system. If a bounded context grows too large, this is the layer that is responsible for orchestrating the system refactoring necessary to split it up.
2. **Bounded Context:** This level is responsible for enforcing its own domain purpose and rules within itself.
3. **Component:** A single module is responsible for describing its technical purpose, language-specific rules, and algorithmic guidelines. Implementations vary widely depending on the technology at this level.
4. **Code:** The code itself should be self-documenting and have relevant comments that describe the *purpose* of the code.

Each level can pass invariant rules and guidance down to lower levels, providing consistency across the entire system.

## A Living System

Notice that documentation and scripting alone are not sufficient. The system must include the autonomous behavior to be able to maintain and fix itself when architectural rules are broken or patterns need to change. It essentially needs to internalize the entire SDLC, regardless of where human checkpoints or steps are needed, and automate as much as possible. This is taking continuous delivery automation to the next level, where the system itself describes how to incorporate and deliver new features and maintain itself.
