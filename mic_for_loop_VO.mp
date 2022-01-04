# Program, which sums N numbers from location 516 onwards, N is saved at
# location 512, store sum at location 508, use vertical organization.

f := smask + 1
a := lshift(f);
# a = lshift(f) = lshift(256) = 512
# a - location for N

d := 0;
# for storing N

mar := a;
rd;
rd;
d := mbr;
# store address a (512) in mar, read value (which gets stored in mbr)

b := lshift(f);
b := + (-1)
b := + (-1)
b := + (-1)
b := + (-1)
b := + (-1)
b := + (-1)
b := + (-1)
b := + (-1)
# b = lshift(f) - 8 = lshift(256) - 8 = 516 - 8 = 508 
# b - location for storing sum

c := lshift(f);
c := c + 1;
c := c + 1;
c := c + 1;
c := c + 1;
# c = 516
# c - location for reading numbers onwards

# loop
e := 0;
1: a := c + d;
d := d + (-1);
# decrement d for looping, set a to be of address 516 + d, e is accumulator

mar := a;
rd;
rd;
f := mbr;
# get value from memory address c + d = 516 + d

e := e + f;
# increase accumulator value

alu := d;
if z then goto 2;
goto 1;
# if sentences

2: mar := b;
mbr := e;
wr;
wr;
# write accumulator value to address 508 