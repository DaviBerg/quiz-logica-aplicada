search_animals(K, P, C, O, F, G, S, Name, Lifespan, Behavior, Diet) :-
  animal(Name, AK, AP, AC, AO, AF, AG, AS, Lifespan, Behavior, Diet),
  match(K, AK),
  match(P, AP),
  match(C, AC),
  match(O, AO),
  match(F, AF),
  match(G, AG),
  match(S, AS).

match(any, _) :- !.
match(X, Y) :- 
  downcase_atom(X, LowerX), 
  downcase_atom(Y, LowerY), 
  LowerX == LowerY.

distinct_values(kingdom, Vs) :- findall(V, animal(_, V, _, _, _, _, _, _, _, _, _), Vs).
distinct_values(phylum,  Vs) :- findall(V, animal(_, _, V, _, _, _, _, _, _, _, _), Vs).
distinct_values(class,   Vs) :- findall(V, animal(_, _, _, V, _, _, _, _, _, _, _), Vs).
distinct_values(order,   Vs) :- findall(V, animal(_, _, _, _, V, _, _, _, _, _, _), Vs).
distinct_values(family,  Vs) :- findall(V, animal(_, _, _, _, _, V, _, _, _, _, _), Vs).
distinct_values(genus,   Vs) :- findall(V, animal(_, _, _, _, _, _, V, _, _, _, _), Vs).
distinct_values(species, Vs) :- findall(V, animal(_, _, _, _, _, _, _, V, _, _, _), Vs).
