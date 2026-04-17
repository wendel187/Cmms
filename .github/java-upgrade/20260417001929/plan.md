# Upgrade Plan: Cmms (20260417001929)

- **Generated**: 2026-04-16 16:00 UTC
- **HEAD Branch**: main
- **HEAD Commit ID**: N/A (changes stashed)

## Available Tools

**JDKs**
- JDK 17.0.18: C:\Users\ta020\.jdks\ms-17.0.18\bin (current project JDK)
- JDK 25.0.2: C:\Users\ta020\AppData\Roaming\Code\User\globalStorage\pleiades.java-extension-pack-jdk\java\25\bin (target, available)

**Build Tools**
- Maven Wrapper: 3.9.x (in project, `./mvnw` / `mvnw.cmd`) - fully compatible with Java 25

## Guidelines

- No specific user constraints provided
- Maintain backward compatibility
- Run full test suite for validation

## Options

- Working branch: appmod/java-upgrade-<SESSION_ID> <!-- user specified, NEVER remove it -->
- Run tests before and after the upgrade: true <!-- user specified, NEVER remove it -->

## Upgrade Goals

<!--
  List ONLY the explicitly user-requested target versions.
  These are the primary goals that drive all other upgrade decisions.

  SAMPLE:
  - Upgrade Java from 8 to 21
  - Upgrade Spring Boot from 2.5.x to 3.2.x
-->

### Technology Stack

| Technology/Dependency | Current | Min Compatible | Why Incompatible |
| --------------------- | ------- | -------------- | ---------------- |
| Java | 17 | 25 | User requested latest LTS |
| Spring Boot | 4.0.5 | 4.0.5 | Already compatible with Java 25 |
| Spring Data JPA | 4.0.x | 4.0.x | Inherited from Spring Boot, compatible |
| Spring Web MVC | 4.0.x | 4.0.x | Inherited from Spring Boot, compatible |
| Maven Wrapper | 3.9.x | 3.9.x | Fully supports Java 25 |
| MySQL Connector | 8.x | 8.x | Compatible with Java 25 |
| Lombok | 1.18.x | 1.18.x | Compatible with Java 25 |

### Derived Upgrades

**None required** - Spring Boot 4.0.5 is the latest version and already fully compatible with Java 25. This is a straightforward LTS-to-LTS runtime upgrade with no dependency changes needed.

## Upgrade Steps

### Step 1: Setup Environment
- **Rationale**: Verify Java 25 and Maven Wrapper are available and functional for the upgrade process.
- **Changes to Make**:
  - [ ] Verify Java 25.0.2 at: C:\Users\ta020\AppData\Roaming\Code\User\globalStorage\pleiades.java-extension-pack-jdk\java\25\bin
  - [ ] Verify Maven Wrapper (mvnw/mvnw.cmd) is executable
  - [ ] No install/upgrade needed (all tools present)
- **Verification**:
  - Command: `mvnw --version`
  - JDK: Current (17)
  - Expected Result: Maven version displayed confirms wrapper is functional

---

### Step 2: Setup Baseline
- **Rationale**: Establish pre-upgrade compile and test results as baseline for measuring upgrade success.
- **Changes to Make**:
  - [ ] Run baseline compilation with Java 17
  - [ ] Run baseline tests with Java 17
  - [ ] Document baseline metrics (test count, pass rate)
- **Verification**:
  - Command: `mvnw clean test-compile -q && mvnw clean test -q`
  - JDK: 17 (current)
  - Expected Result: Compilation SUCCESS; document test results (baseline pass rate)

---

### Step 3: Upgrade Java Runtime to 25
- **Rationale**: Update pom.xml to target Java 25 and verify compilation + tests pass.
- **Changes to Make**:
  - [ ] Update pom.xml: change `<java.version>17</java.version>` to `<java.version>25</java.version>`
  - [ ] Verify Maven Wrapper compatibility (no change needed, 3.9.x supports Java 25)
  - [ ] Compile and test with Java 25
- **Verification**:
  - Command: `mvnw clean test-compile -q` (then if successful: `mvnw clean test -q`)
  - JDK: 25
  - Expected Result: Compilation SUCCESS (both source and test code); tests pass at or above baseline rate

---

### Step 4: Final Validation
- **Rationale**: Confirm all upgrade criteria met: Java 25 target achieved, all tests pass, no warnings.
- **Changes to Make**:
  - [ ] Run clean build and full test suite with Java 25
  - [ ] Verify no critical compilation warnings
  - [ ] Confirm 100% test pass rate (or ≥ baseline if any pre-existing failures)
  - [ ] Document upgrade completion
- **Verification**:
  - Command: `mvnw clean verify -q`
  - JDK: 25
  - Expected Result: All tests PASS; build completes successfully

## Key Challenges

**None identified** - This is a straightforward LTS-to-LTS upgrade (Java 17 → 25) with Spring Boot 4.0.5, which is already optimized for Java 21+. No breaking API changes, module system conflicts, or dependency incompatibilities are expected. Migration is primarily a runtime configuration change.
