# Program, which sums N numbers from location 520 onwards, N is saved at
# location 512, store sum at location 256, use horizontal organization.

a := lshift(smask + 1);
# a = lshift(smask + 1) = lshift(256) = lshift(0100) = 0200 = 512
# a - location for N

d := 0;
# for storing N

mar := a; rd;
rd;
d := mbr;
# store address a (512) in mar, read value (which gets stored in mbr)

b := smask + 1;
# b = smask + 1 = 255 + 1 = 256
# b - location for storing sum

c := lshift(smask + 1);
# c = 512

c := c + 1;
c := c + 1;
c := c + 1;
c := c + 1;
c := c + 1;
c := c + 1;
c := c + 1;
c := c + 1;
# c = 520
# c - location for reading numbers onwards

# loop
e := 0;
1: a := c + d;
d := d + (-1);
# decrement d for looping, set a to be of address 520 + d, e is accumulator

mar := a;
rd;
rd;
f := mbr;
# get value from memory address c + d = 520 + d

e := e + f;
# increase accumulator value

alu := d; if z then goto 2;
goto 1;
# if sentences

2: mar := b;
mbr := e; wr;
wr;
# write accumulator value to address 256