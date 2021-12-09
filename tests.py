import subprocess
import sys
import multiprocessing


tests = ['vpis', 'izbris', 'izpis']


def run_script(header, args, i):
    path = './imenik_' + header + '/target/debug/imenik_' + header
    print(f"{i}. {header} {args}")
    subprocess.check_call([path] + args)


def get_script_args(header: str, i: int) -> str:
    if header == 'vpis':
        return ['Test', 'User', str(i)]
    if header == 'izbris' or header == 'izpis':
        return [str(i)]


def test_one(header: str, i: int):
    args = get_script_args(header, i)
    run_script(header, args, i)


def test_all(i: int):
    if i % len(tests) == 0:
        header = 'vpis'
    elif i % len(tests) == 1:
        header = 'izbris'
    else:
        header = 'izpis'

    test_one(header, i)


def start():
    if len(sys.argv) == 1:
        for i in range(len(tests) * 10):
            t = multiprocessing.Process(target=test_all, args=[i])
            t.start()
        return

    for i in range(len(tests) * 10):
        t = multiprocessing.Process(target=test_one, args=[sys.argv[1], i])
        t.start()


if __name__ == "__main__":
    start()
