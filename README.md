# Examples

| flag | use                                    |
| ---- | -------------------------------------- |
| -t   | -t [function name - read, fread, mmap] |
| -b   | -b [size of buffer]                    |

- <em>b</em> only works with `read()` and `fread()`

# Commands

| command                                 |
| --------------------------------------- |
| ./histZnakov -b 10 -t read file.txt     |
| ./histZnakov -b 10 -t mmap besedilo.txt |
