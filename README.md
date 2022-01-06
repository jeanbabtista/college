# Examples

| flag | use                                    |
| ---- | -------------------------------------- |
| -t   | -t [function name - read, fread, mmap] |
| -b   | -b [size of buffer]                    |
| -f   | -f [file name]                         |

- <em>b</em> only works with `read()` and `fread()`

# Commands

- Warning: file name has to be specified at the end.

| command                                      |
| -------------------------------------------- |
| `./histZnakov -b 10 -t read -f file.txt`     |
| `./histZnakov -b 10 -t mmap -f besedilo.txt` |
