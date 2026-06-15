# Kata

## Proposed Solution

- [Documentation](documentation/architecture.md)

## **Objectives**

- Demonstrate what you can do within a reasonable time and show how you code in real-life situations.
- This project should soon go into production regarding the quality of the code.
- The API must adhere to a Hexagonal or Clean Code architecture and must include tests.

## **Delivery**
- Fork this repo and create a PR on the `develop` branch so that we can provide feedback.

## **Application**
For this project, we need an API that:

1. Retrieves the temperature from a `TemperatureSensor` component (returns the temperature in degrees Celsius).
2. Sets the state of the Sensor to “HOT” when the captured temperature is greater than or equal to 35°C.
3. Sets the state of the Sensor to “COLD” when the captured temperature is less than 22°C.
4. Sets the state of the Sensor to “WARM” when the captured temperature is greather than or equal to 22°C and less than 35°C.
5. Retrieves the history of the last fifteen temperature requests.
6. Allows redefining the thresholds for “HOT”, “COLD”, and “WARM”.


## **Minimal Stack**

- Node.js
- Docker
- Jest

## Reference
- [Git Commit Messages: Best Practices & Guidelines](https://initialcommit.com/blog/git-commit-messages-best-practices)
