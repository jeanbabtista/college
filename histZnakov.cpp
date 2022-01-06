#include <iostream>
#include <string>
#include <map>
#include <fstream>
#include <chrono>
#include <unistd.h>
#include <sys/mman.h>
#include <sys/stat.h>
#include <fcntl.h>

enum class ReadType { read, fread, mmap, none };

class Data {
public:
    unsigned bufferSize;
    ReadType readType;
    std::string file;

    const std::string options;

    Data() : options("btf"), bufferSize(0), readType(ReadType::none), file("") {}
};

class AsciiMap {
private:
    const unsigned
        min,
        max;

public:
    std::map<char, unsigned> map;

    AsciiMap() : min(33), max(128) {
        for (auto i = min; i < max; i++)
            map[i] = 0;
    }

    inline void insert(char c) {
        const auto cInt = static_cast<unsigned>(c);

        if (cInt < min || cInt > max)
            return;

        map[c]++;
    }

    const void print() const {
        for (const auto& element : map)
            if (element.second > 0)
                std::cout << element.first << " - " << element.second << std::endl;
    }
};

void parseArgs(Data&&, int, char**), printArgs(Data&&), getStats(Data&&, AsciiMap&&);

int main(int argc, char** argv) {
    Data data;
    AsciiMap ascii;

    // handle arguments
    parseArgs(std::move(data), argc, argv);
    // printArgs(std::move(data));

    // histogram statistics
    const auto start = std::chrono::high_resolution_clock::now();
    getStats(std::move(data), std::move(ascii));
    const auto end = std::chrono::high_resolution_clock::now();

    // print map
    std::cout << "Histogram:" << std::endl;
    ascii.print();

    // print time
    std::cout << "\nTime taken: " << std::chrono::duration_cast<std::chrono::microseconds>(end - start).count() << " microseconds." << std::endl;
}

void handleError(const std::string& message) {
    std::cout << "Error: " << message << std::endl;
    exit(-1);
}

void parseArgs(Data&& data, int argc, char** argv) {
    argc--;
    argv++;

    for (auto i = 0; i < argc - 1 && argc > 0; i += 2) {
        /* flags are at indexes 0, 2, 4, ...
        arguments are at indexes 1, 3, 5, ... */

        const auto flag = std::string(argv[i]);

        if (flag.length() != 2)
            handleError("flag does not have the correct length of 2.");

        if (flag.at(0) != '-')
            handleError("flag has to start with '-'.");

        const auto option = flag[1];
        const auto options = data.options;

        // check if flag option is valid
        auto valid = false;
        for (const auto& availableOption : options)
            if (option == availableOption)
                valid = true;

        if (!valid)
            handleError("flag option is invalid. Available options are 'b', 't', 'f'.");

        const auto value = std::string(argv[i + 1]);

        switch (option) {
        case 'b':
            try {
                data.bufferSize = static_cast<unsigned>(stoi(value));
            }
            catch (...) {
                handleError("invalid argument passed as buffer size.");
            }

            break;
        case 't':
            data.readType =
                value == "read" ? ReadType::read
                : value == "fread" ? ReadType::fread
                : value == "mmap" ? ReadType::mmap
                : ReadType::none;

            break;
        case 'f':
            data.file = value;
            break;
        }
    }

    if (data.bufferSize == 0)
        handleError("you have to provide valid buffer size.");

    if (data.readType == ReadType::none)
        handleError("you have to provide valid read type function [read, fread, mmap].");

    if (!data.file.length())
        handleError("file name cannot be empty.");
}

void printArgs(Data&& data) {
    std::cout << "buffer size: " << data.bufferSize << ", read type: ";

    switch (data.readType) {
    case ReadType::read:
        std::cout << "read";
        break;
    case ReadType::fread:
        std::cout << "fread";
        break;
    case ReadType::mmap:
        std::cout << "mmap";
        break;
    }

    std::cout << ", file: " << data.file << std::endl;
}

void getStats(Data&& data, AsciiMap&& ascii) {
    switch (data.readType) {
    case ReadType::read: {
        // open file
        const auto fd = open(data.file.c_str(), O_RDONLY);
        if (fd == -1)
            handleError("unable to open file.");

        // read file
        while (true) {
            char buffer[data.bufferSize + 1] = "\0";
            int r = read(fd, buffer, data.bufferSize);

            if (r <= 0)
                break;

            // insert into map
            for (const auto& c : std::string(buffer))
                ascii.insert(c);
        }

        // close file
        close(fd);
        break;
    }
    case ReadType::fread: {
        // open file
        std::ifstream file(data.file);
        if (!file.is_open())
            handleError("unable to open file.");

        // read file
        while (file.good()) {
            char buffer[data.bufferSize + 1] = "\0";
            file.read(buffer, data.bufferSize);

            // insert into map
            for (const auto& c : std::string(buffer))
                ascii.insert(c);
        }

        // close file
        file.close();
        break;
    }
    case ReadType::mmap:
        // open file
        const auto fd = open(data.file.c_str(), O_RDONLY);
        if (fd == -1)
            handleError("unable to open file.");

        struct stat file_stats;
        if (fstat(fd, &file_stats) == -1)
            handleError("file_stats structure error.");

        const auto size = file_stats.st_size;

        auto data = static_cast<char*>(mmap(0, size, PROT_READ, MAP_PRIVATE, fd, 0));
        if (data == MAP_FAILED)
            handleError("mmap function error.");

        for (const auto& c : std::string(data))
            ascii.insert(c);

        if (munmap(data, size) == -1)
            handleError("munmap function error.");

        // close file
        close(fd);
        break;
    }
}
