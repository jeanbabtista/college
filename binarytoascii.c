#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <errno.h>
#include <limits.h>
#include <ctype.h>

#define MAX 1000
#define OPTIONS "oiOI" // options for flags, for example -o <arg>, -i <arg>, ...

void
parse_args(char*, char*, char*, char*, int, char**),
handle_error(const char*), copy(char*, char*),
stoi(int*, const char*);

int main(int argc, char** argv) {
    char
        file_name[MAX],
        file_descriptor[MAX],
        first_flag,
        second_flag;

    // set file_name, file_descriptor to correct values from command-line arguments
    // and set first_flag either to 'o' or 'i' and second_flag to 'O' or 'I'
    parse_args(file_name, file_descriptor, &first_flag, &second_flag, argc, argv);

    // convert file_descriptor to number
    int fd;
    stoi(&fd, file_descriptor);
    if (fd == INT_MAX) fd = 1;

    // print
    printf("file name: %s, mode: %c\n", file_name, first_flag);
    printf("file desc: %d, mode: %c\n", fd, second_flag);
}

void handle_error(const char* message) {
    printf("%s\n", message);
    exit(-1);
}

void copy(char* dest, char* src) {
    for (int i = 0; i < strlen(src); i++)
        dest[i] = src[i];
    dest[strlen(src)] = '\0';
}

void stoi(int* number, const char* string_number) {
    if (string_number[0] == '\0' || isspace(number[0])) {
        *number = INT_MAX;
        return;
    }

    char* end;
    long value = strtol(string_number, &end, 10);

    if (*end != '\0') {
        *number = INT_MAX;
        return;
    }

    *number = (int)value;
}

void parse_args(char* file_name, char* file_descriptor, char* first_flag, char* second_flag, int argc, char** argv) {
    argc--;
    argv++;

    if (argc % 2)
        handle_error("Error: wrong number of arguments suplied. Every flag requires a value.");

    char
        * values[2] = { "", "" },
        flags[2] = ""; // ~ flag[2] = {0, 0};

    for (unsigned i = 0; i < argc - 1 && argc > 0; i += 2) {
        /* flags are at indexes 0, 2, 4, ...
        arguments are at indexes 1, 3, 5, ... */

        const char* flag = argv[i];

        if (strlen(flag) != 2)
            handle_error("Error: flag does not have the correct length of 2.");

        if (flag[0] != '-')
            handle_error("Error: flag has to start with '-'.");

        const char option = flag[1];

        // check if flag option is valid
        int valid = 0;
        for (unsigned j = 0; j < strlen(OPTIONS); j++)
            if (option == OPTIONS[j])
                valid = 1;

        if (!valid)
            handle_error("Error: flag option is invalid. Available options are 'o', 'i', 'O' and 'I'.");

        char* arg = argv[i + 1];

        switch (option) {
        case 'o':
        case 'i':
            flags[0] = option;
            values[0] = arg;
            break;
        case 'O':
        case 'I':
            flags[1] = option;
            values[1] = arg;
            break;
        default:
            handle_error("Error: wrong switch case value.");
        }
    }

    // set arguments visible in main function
    copy(file_name, values[0]);
    copy(file_descriptor, values[1]);

    // set flags
    *first_flag = flags[0];
    *second_flag = flags[1];
}
