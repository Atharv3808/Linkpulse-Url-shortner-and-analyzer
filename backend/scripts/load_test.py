import os
import time
from concurrent.futures import ThreadPoolExecutor

import requests

# Benchmark redirect endpoint
TARGET_URL = os.getenv("TARGET_URL", "http://localhost:8000/launch2026")
CONCURRENT_REQUESTS = 100
WORKERS = 10


def send_request(request_id):
    start = time.time()
    try:
        res = requests.get(TARGET_URL, allow_redirects=False, timeout=5)
        latency = (time.time() - start) * 1000
        return res.status_code, latency
    except Exception:
        return 500, 0


def main():
    print(f"🚀 Starting LinkPulse Redirect Load Test on '{TARGET_URL}'")
    print(f"Total Requests: {CONCURRENT_REQUESTS}, Concurrency Level: {WORKERS}")

    start_total = time.time()
    status_codes = []
    latencies = []

    with ThreadPoolExecutor(max_workers=WORKERS) as executor:
        results = list(executor.map(send_request, range(CONCURRENT_REQUESTS)))

    total_duration = time.time() - start_total

    for code, lat in results:
        status_codes.append(code)
        if lat > 0:
            latencies.append(lat)

    success_count = sum(1 for c in status_codes if c in (302, 200))
    avg_latency = sum(latencies) / len(latencies) if latencies else 0
    rps = CONCURRENT_REQUESTS / total_duration

    print("\n📊 Load Test Results:")
    print(f"  • Total Time: {total_duration:.2f} seconds")
    print(f"  • Requests/sec (RPS): {rps:.2f}")
    print(f"  • Successful Redirects (302): {success_count} / {CONCURRENT_REQUESTS}")
    print(f"  • Average Latency: {avg_latency:.2f} ms")


if __name__ == "__main__":
    main()
