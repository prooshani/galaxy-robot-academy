# Debugging Game — Session 04

Repair and explain:

```python
if password = "ORBIT":
```

```python
if energy >= 50
```

```python
if energy >= 50:
print("Launch approved.")
```

Wrong branch order:

```python
if energy >= 50:
    print("Launch possible.")
elif energy >= 80:
    print("Full power.")
```

Logic bug: danger level 5 reports safe. Test boundaries.
