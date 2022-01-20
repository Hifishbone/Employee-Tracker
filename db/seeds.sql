INSERT INTO department (name)
VALUES
  ('DEP AAA'),
  ('DEP BBB'),
  ('DEP CCC');


INSERT INTO role (title, salary, department_id)
VALUES
  ('A 111', 1111.11, 1),
  ('A 222', 2222.22, 1),
  ('B 111', 3333.33, 2),
  ('B 222', 4444.44, 2),
  ('C 111', 5555.55, 3);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
  ('Unica', 'Zurn', 5, NULL),
  ('Dora', 'Carrington', 4, 1),
  ('Edward', 'Bellamy', 4, 1),
  ('Montague', 'Summers', 4, 1),
  ('Charles', 'LeRoi', 3, 2),
  ('Katherine', 'Mansfield', 3, 4),
  ('Ronald', 'Firbank', 2, 5),
  ('Virginia', 'Woolf', 2, 5),
  ('Piers', 'Gaveston', 2, 5),
  ('Octavia', 'Butler', 1, 6);

-- SELECT * FROM department;
-- SELECT * FROM role;
-- SELECT * FROM employee;
