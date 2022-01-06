# Examples

| flag | use                                    |
| ---- | -------------------------------------- |
| -t   | -t [function name - read, fread, mmap] |
| -b   | -b [size of buffer]                    |
| -f   | -f [file name]                         |

- <em>b</em> only works with `read()` and `fread()`

# Commands

- Warning: file name has to be specified at the end.

| command                                  |
| ---------------------------------------- |
| `./histZnakov -b 10 -t read -f file.txt` |
| `./histZnakov -b 10 -t mmap -f file.txt` |

# Test data

## File sizes

- program for generating random files with fixed sizes:
  https://onlinefiletools.com/generate-random-text-file

- 256 B
- 512 B
- 1 kB
- 256 kB
- 512 kB
- 1 MB
- 256 MB

## Buffer sizes

- 1 B
- 256 B
- 512 B
- 1 kB
- 2 kB
- 4 kB
- 8 kB
- 16 kB
