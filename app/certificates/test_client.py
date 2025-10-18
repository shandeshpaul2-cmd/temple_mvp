#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Test client for certificate generation service.
Run this to test the certificate service independently.
"""

import requests
import json
import time
from datetime import datetime, date
from decimal import Decimal

# Service configuration (DONATION CERTIFICATES ONLY)
BASE_URL = "http://localhost:5001"

def test_health_check():
    """Test the health check endpoint"""
    print("🔍 Testing health check...")
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=5)
        if response.status_code == 200:
            print(f"✅ Health check passed: {response.json()}")
            return True
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Health check error: {e}")
        return False

def test_certificate_generation():
    """Test certificate generation"""
    print("\n📄 Testing certificate generation...")

    test_data = {
        "donor_name": "Test Donor",
        "amount": "1500.00",
        "donation_id": f"TEST-{datetime.now().strftime('%d%m%y')}-0001",
        "donation_date": datetime.now().strftime('%Y-%m-%d'),
        "payment_mode": "Razorpay",
        "org_name": "Shri Raghavendra Swamy Brundavana Sannidhi, Halasuru",
        "org_subtitle": "Guru Seva Mandali (Regd.)",
        "show_80g_note": True
    }

    try:
        response = requests.post(
            f"{BASE_URL}/generate",
            json=test_data,
            timeout=30
        )

        if response.status_code == 200:
            result = response.json()
            print(f"✅ Certificate generated: {result['filename']}")
            return result['filename']
        else:
            error = response.json()
            print(f"❌ Certificate generation failed: {error}")
            return None

    except Exception as e:
        print(f"❌ Certificate generation error: {e}")
        return None

def test_certificate_download(filename):
    """Test certificate download"""
    if not filename:
        print("⏭️  Skipping download test (no filename)")
        return False

    print(f"\n📥 Testing certificate download: {filename}")

    try:
        response = requests.get(
            f"{BASE_URL}/download/{filename}",
            timeout=10
        )

        if response.status_code == 200:
            # Save to test downloads
            with open(f"test_downloads/{filename}", "wb") as f:
                f.write(response.content)
            print(f"✅ Certificate downloaded successfully (saved to test_downloads/)")
            return True
        else:
            print(f"❌ Download failed: {response.status_code}")
            return False

    except Exception as e:
        print(f"❌ Download error: {e}")
        return False

def test_certificate_list():
    """Test certificate listing"""
    print("\n📋 Testing certificate listing...")

    try:
        response = requests.get(f"{BASE_URL}/certificates", timeout=10)

        if response.status_code == 200:
            result = response.json()
            print(f"✅ Found {result['total']} certificates")
            for cert in result['certificates'][:3]:  # Show first 3
                print(f"   📄 {cert['filename']} ({cert['size']} bytes)")
            return True
        else:
            print(f"❌ List failed: {response.status_code}")
            return False

    except Exception as e:
        print(f"❌ List error: {e}")
        return False

def main():
    """Run all tests"""
    print("🚀 Certificate Service Test Client")
    print("=" * 50)

    # Create test downloads directory
    import os
    os.makedirs("test_downloads", exist_ok=True)

    # Run tests
    health_ok = test_health_check()

    if not health_ok:
        print("\n❌ Service is not responding. Please start the service first:")
        print("   ./start.sh")
        return

    filename = test_certificate_generation()
    test_certificate_download(filename)
    test_certificate_list()

    print("\n🎉 Tests completed!")

if __name__ == "__main__":
    main()