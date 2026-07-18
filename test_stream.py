import urllib.request, time
def test():
    req = urllib.request.Request('https://market-pulse-vert.vercel.app/api/analyst/stream?week=2026-w21&refresh=1')
    try:
        with urllib.request.urlopen(req) as response:
            for line in response:
                print(f"{time.time()}: {line}")
    except Exception as e:
        print('Error:', e)
test()