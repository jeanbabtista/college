#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <errno.h>
#include <limits.h>
#include <ctype.h>

#define MAX 1000

void parse_args(char*, char*, int, char**), handle_error(const char*), copy(char*, char*), stoi(int*, const char*);

int main(int argc, char** argv) {
    char file_name[MAX];
    char file_descriptor[MAX];

    parse_args(file_name, file_descriptor, argc, argv);

    int number;
    stoi(&number, file_descriptor);
    if (number == INT_MAX) number = 1;

    printf("file name: %s\n", file_name);
    printf("file desc: %s\n", file_descriptor);
    printf("number: %d\n", number);
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

void parse_args(char* file_name, char* file_descriptor, int argc, char** argv) {
    argc--;
    argv++;

    if (argc % 2)
        handle_error("Error: wrong number of arguments suplied. Every flag requires a value.");

    char* values[2] = { "", "" };

    for (unsigned i = 0; i < argc - 1 && argc > 0; i += 2) {
        /* flags are at indexes 0, 2, 4, ...
        arguments are at indexes 1, 3, 5, ... */

        const char
            * options = "oiOI",
            * flag = argv[i];

        if (strlen(flag) != 2)
            handle_error("Error: flag does not have the correct length of 2.");

        if (flag[0] != '-')
            handle_error("Error: flag has to start with '-'.");

        const char option = flag[1];

        // check if flag option is valid
        int valid = 0;
        for (unsigned j = 0; j < strlen(options); j++)
            if (option == options[j])
                valid = 1;

        if (!valid)
            handle_error("Error: flag option is invalid. Available options are 'o', 'i', 'O' and 'I'.");

        char* arg = argv[i + 1];

        switch (option) {
        case 'o':
        case 'i':
            values[0] = arg;
            break;
        case 'O':
        case 'I':
            values[1] = arg;
            break;
        default:
            handle_error("Error: wrong switch case value.");
        }
    }

    // make args visible outside
    copy(file_name, values[0]);
    copy(file_descriptor, values[1]);
}
