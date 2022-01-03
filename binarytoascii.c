#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <errno.h>
#include <limits.h>
#include <ctype.h>
#include <unistd.h>
#include <fcntl.h>

#define MAX 1000
#define OPTIONS "oiOI" // options for flags, for example -o <arg>, -i <arg>, ...

struct data {
    char flag;
    char file_name[MAX];
    char fd[MAX];
} typedef data;

void parse_args(data*, data*, int, char**),
handle_error(const char*),
copy(char*, char*),
read_file(char*, int),
write_file(char*, int);

int main(int argc, char** argv) {
    data input, output;
    FILE* outputFile;

    // set defaults
    input.flag = 'i';
    strcpy(input.fd, "0");
    strcpy(input.file_name, "");
    output.flag = 'o';
    strcpy(output.fd, "1");
    strcpy(output.file_name, "");

    // parse arguments
    parse_args(&input, &output, argc, argv);

    // convert file descriptors to numbers
    char* end;
    int fdInput = strtol(input.fd, &end, 10);
    if (*end != '\0')
        fdInput = 0;

    int fdOutput = strtol(output.fd, &end, 10);
    if (*end != '\0')
        fdOutput = 1;

    // printf("input:\n\t- flag: %c\n\t- file_name: %s\n\t- fd: %d\n", input.flag, input.file_name, fdInput);
    // printf("output:\n\t- flag: %c\n\t- file_name: %s\n\t- fd: %d\n", output.flag, output.file_name, fdOutput);

    // open file if user specified it
    int is_opened_input = 0;
    if (*(input.file_name)) {
        fdInput = open(input.file_name, O_RDWR);
        if (fdInput == -1)
            handle_error("Error: unable to open input file.");

        is_opened_input = 1;
    }

    int is_opened_output = 0;
    if (*(output.file_name)) {
        fdOutput = open(output.file_name, O_RDWR);
        if (fdOutput == -1) {
            outputFile = fopen(output.file_name, "w");

            if (!outputFile)
                handle_error("Error: unable to create file.");
        }

        fdOutput = open(output.file_name, O_RDWR);
        if (fdOutput == -1)
            handle_error("Error: unable to open output file.");

        is_opened_output = 1;
    }

    unsigned size = 0;
    int bytes[MAX];

    // read file
    while (1) {
        // set reading / writing buffer
        const unsigned length = 1;
        char buffer[length];

        int r = read(fdInput, buffer, length);
        if (r <= 0)
            break;

        bytes[size++] = (int)buffer[0];
    }

    // write to fd
    for (unsigned i = 0; i < size; i++) {
        char byte[MAX];
        const int size = sprintf(byte, "%d", bytes[i]);

        write(fdOutput, byte, size);
        write(fdOutput, " ", sizeof(char));
    }

    write(fdOutput, "\n", sizeof(char));

    // close file
    if (is_opened_input)
        close(fdInput);

    if (is_opened_output)
        close(fdOutput);

    if (outputFile)
        fclose(outputFile);
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

void parse_args(data* input, data* output, int argc, char** argv) {
    argc--;
    argv++;

    if (argc % 2)
        handle_error("Error: wrong number of arguments supplied. Every flag requires a value.");

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

        char* value = argv[i + 1];

        switch (option) {
        case 'o':
            output->flag = option;
            strcpy(output->file_name, value);
            break;
        case 'O':
            output->flag = option;
            strcpy(output->fd, value);
            break;
        case 'i':
            input->flag = option;
            strcpy(input->file_name, value);
            break;
        case 'I':
            input->flag = option;
            strcpy(input->fd, value);
            break;
        }
    }
}
