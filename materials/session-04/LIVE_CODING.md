# Live Coding — Session 04

## Basic decision

```python
energy = 65

if energy >= 50:
    print("Launch approved.")
```

## Two outcomes

```python
energy = 35

if energy >= 50:
    print("Launch approved.")
else:
    print("Recharge required.")
```

## Three outcomes

```python
energy = 75

if energy >= 80:
    print("Full power.")
elif energy >= 50:
    print("Launch possible.")
else:
    print("Recharge required.")
```

## Text comparison

```python
password = input("Security code: ")

if password == "ORBIT":
    print("Access granted.")
else:
    print("Access denied.")
```

## Planet safety

```python
danger = int(input("Danger level 1–5: "))

if danger <= 2:
    print("Safe to explore.")
elif danger <= 4:
    print("Proceed with caution.")
else:
    print("Exploration cancelled.")
```
