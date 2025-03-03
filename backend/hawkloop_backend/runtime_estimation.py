import time

# Function to estimate runtime
def estimate_runtime(function, *args, **kwargs):
    start_time = time.time()
    result = function(*args, **kwargs)
    end_time = time.time()
    print(f"Estimated Runtime: {end_time - start_time:.4f} seconds")
    return result

# Example usage
if __name__ == '__main__':
    def sample_function():
        time.sleep(2)  # Simulate a time-consuming process
        print("Sample function executed")

    estimate_runtime(sample_function)
