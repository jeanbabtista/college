# Examples

| flag | use                                          |
| ---- | -------------------------------------------- |
| -t   | -t &lt;function name - read, fread, mmap&gt; |
| -b   | -b &lt;size of buffer&gt;                    |
| -f   | -f &lt;file name&gt;                         |

- <em>-b</em> only works with `read()` and `fread()`

# Commands

| command (first `cd build/`)                      |
| ------------------------------------------------ |
| `./histZnakov -b 10 -t read -f ../data/file.txt` |
| `./histZnakov -b 10 -t mmap -f ../data/file.txt` |

# Test data

- get test results by running script `bash script.sh data/`

## File sizes

- program for generating random files with fixed sizes:
  https://onlinefiletools.com/generate-random-text-file

- 256 B, 512 B, 1 kB, 256 kB, 512 kB, 1 MB, 256 MB

## Buffer sizes

- 1 B, 256 B, 512 B, 1 kB, 2 kB, 4 kB, 8 kB, 16 kB
