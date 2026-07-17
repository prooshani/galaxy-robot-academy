# Answer Guide — Session 04

Sample:

```python
planet = input("Planet: ")
danger = int(input("Danger level 1–5: "))
oxygen = input("Oxygen available? yes/no: ")

if danger <= 2:
    print(f"{planet}: low danger.")
elif danger <= 4:
    print(f"{planet}: proceed with caution.")
else:
    print(f"{planet}: exploration cancelled.")

if oxygen == "yes":
    print("Oxygen detected.")
else:
    print("Space suit required.")
```

Review:

- rules match requirements;
- branch order correct;
- indentation correct;
- numeric conversion works;
- output understandable;
- reflection identifies a real design decision.
