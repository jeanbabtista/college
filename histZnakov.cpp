#include <iostream>
#include <unistd.h>

/* Navodila
Pripravite tudi kratko poročilo v katerem izpišete rezultate in komentirate na učinkovitost branja podatkov z read, fread in mmap klicem. S program preizkusite branje datotek različnih velikosti - 256 B, 512B, 1KB, 256KB, 512KB, 1MB, 256MB. Za mmap te teste izvedete enkrat, za read in fread pa te teste ponovitve za različne velikosti predpomnilnika: 1B, 256B, 512B, 1KB, 2KB, 4KB, 8KB in 16KB. Na standardni izhod nato izpišite histogram.
Čas izvajanja lahko izmerite z ukazom time.
*/

// read(), ifstream.read(), mmap()

// -t <tip branja - read, fread, mmap>
// -b <velikost predpomnilnika v bajtih, le pri read in fread, pri mmap pa ne!>

/* Primeri
$ echo hello world > besedilo.txt
$ ./histZnakov -b 10 -t read besedilo.txt
d - 1
e - 1
h - 1
l - 3
o - 2
r - 1
w - 1

$ echo aa bc ddd ef > besedilo.txt
$ ./histZnakov -b 10 -t mmap besedilo.txt
a - 2
b - 1
c - 1
d - 3
e - 1
f - 1
*/

static constexpr char OPTIONS[] = "bt";

enum class ReadType { read, fread, mmap };

void parseArgs(unsigned*, ReadType*, int, char**);

int main() {
    std::cout << "Hello World!" << std::endl;
    return 0;
}

void handleError(const std::string& message) {
    std::cout << "Error: " << message << std::endl;
    exit(-1);
}

void parseArgs(unsigned* size_buffer, ReadType* read_type, int argc, char** argv) {
    argc--;
    argv++;

    if (argc % 2)
        handleError("wrong number of arguments supplied. Every flag requires a value.");

    for (auto i = 0; i < argc - 1 && argc > 0; i += 2) {
        /* flags are at indexes 0, 2, 4, ...
        arguments are at indexes 1, 3, 5, ... */

        const auto flag = std::string(argv[i]);

        if (flag.length() != 2)
            handleError("flag does not have the correct length of 2.");

        if (flag.at(0) != '-')
            handleError("flag has to start with '-'.");

        const auto option = flag[1];
        const auto options = std::string(OPTIONS);

        // check if flag option is valid
        auto valid = false;
        for (auto j = 0; j < options.length(); j++)
            if (option == OPTIONS[j])
                valid = true;

        if (!valid)
            handleError("flag option is invalid. Available options are 'b' and 't'.");

        const auto value = argv[i + 1];

        switch (option) {
        case 'b':
            break;
        case 't':
            break;
        }
    }
}
