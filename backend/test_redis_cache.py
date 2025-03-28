from django.test import TestCase
from django.core.cache import cache
import time

class RedisCacheTests(TestCase):
    def setUp(self):
        # Clear the cache before each test
        cache.clear()

    def test_cache_set_and_get(self):
        """
        Test that we can set a key in the cache and retrieve it.
        """
        cache.set('test_key', 'test_value', timeout=30)
        value = cache.get('test_key')
        self.assertEqual(value, 'test_value', "The cache should return the value that was set.")

    def test_cache_timeout(self):
        """
        Test that a key expires after the timeout period.
        """
        cache.set('temp_key', 'temp_value', timeout=1)
        time.sleep(2)  # Wait long enough for the key to expire
        value = cache.get('temp_key')
        self.assertIsNone(value, "The key should have expired and no value should be returned.")

    def test_large_value_storage(self):
        """
        Test that the cache can store and retrieve a large value.
        """
        large_value = 'a' * 100000  # A string of 100,000 characters
        cache.set('large_key', large_value, timeout=60)
        value = cache.get('large_key')
        self.assertEqual(value, large_value, "The cache should correctly store and retrieve a large value.")
