# DH exchange:

Alice -> A
Bob -> B

AB | generate prime number q and int t
AB | generate private key Priv(A | B) < q
AB | calculate public key Publ(A | B) = t ^ Priv(A | B)

A | sends Publ(A) to B
B | sends Publ(B) to A

A | calculates secret key K(A) = Publ(B) ^ Priv(A)
B | calculates secret key K(B) = Publ(A) ^ Priv(B)

K(A) === K(B)
