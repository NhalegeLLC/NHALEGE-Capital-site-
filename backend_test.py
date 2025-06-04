import requests
import json
import time
from datetime import datetime

# Backend URL from frontend/.env
BACKEND_URL = "https://8a059ba6-e399-4076-bf2c-02e1d0553df2.preview.emergentagent.com/api"

def test_root_endpoint():
    """Test the root endpoint"""
    print("\n=== Testing Root Endpoint ===")
    try:
        response = requests.get(f"{BACKEND_URL}/")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        assert response.status_code == 200
        assert response.json() == {"message": "Hello World"}
        print("✅ Root endpoint test passed")
        return True
    except Exception as e:
        print(f"❌ Root endpoint test failed: {str(e)}")
        return False

def test_create_status_check():
    """Test creating a status check"""
    print("\n=== Testing Create Status Check ===")
    try:
        payload = {"client_name": f"Test Client {datetime.now().isoformat()}"}
        response = requests.post(f"{BACKEND_URL}/status", json=payload)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        assert response.status_code == 200
        assert "id" in response.json()
        assert response.json()["client_name"] == payload["client_name"]
        assert "timestamp" in response.json()
        print("✅ Create status check test passed")
        return response.json()
    except Exception as e:
        print(f"❌ Create status check test failed: {str(e)}")
        return None

def test_get_status_checks():
    """Test getting status checks"""
    print("\n=== Testing Get Status Checks ===")
    try:
        response = requests.get(f"{BACKEND_URL}/status")
        print(f"Status Code: {response.status_code}")
        print(f"Response contains {len(response.json())} status checks")
        if len(response.json()) > 0:
            print(f"First status check: {response.json()[0]}")
        assert response.status_code == 200
        assert isinstance(response.json(), list)
        print("✅ Get status checks test passed")
        return True
    except Exception as e:
        print(f"❌ Get status checks test failed: {str(e)}")
        return False

def test_database_connectivity():
    """Test database connectivity by creating and then retrieving a status check"""
    print("\n=== Testing Database Connectivity ===")
    try:
        # Create a unique status check
        unique_name = f"DB Test {int(time.time())}"
        payload = {"client_name": unique_name}
        create_response = requests.post(f"{BACKEND_URL}/status", json=payload)
        assert create_response.status_code == 200
        created_id = create_response.json()["id"]
        
        # Wait a moment for the database to update
        time.sleep(1)
        
        # Retrieve all status checks and check if our entry is there
        get_response = requests.get(f"{BACKEND_URL}/status")
        assert get_response.status_code == 200
        
        # Find our entry in the list
        found = False
        for status in get_response.json():
            if status["id"] == created_id:
                found = True
                assert status["client_name"] == unique_name
                break
        
        assert found, "Created status check not found in retrieved data"
        print("✅ Database connectivity test passed")
        return True
    except Exception as e:
        print(f"❌ Database connectivity test failed: {str(e)}")
        return False

def test_cors_configuration():
    """Test CORS configuration by sending a preflight request"""
    print("\n=== Testing CORS Configuration ===")
    try:
        headers = {
            "Origin": "http://example.com",
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "Content-Type"
        }
        response = requests.options(f"{BACKEND_URL}/status", headers=headers)
        print(f"Status Code: {response.status_code}")
        print(f"Access-Control-Allow-Origin: {response.headers.get('Access-Control-Allow-Origin')}")
        print(f"Access-Control-Allow-Methods: {response.headers.get('Access-Control-Allow-Methods')}")
        print(f"Access-Control-Allow-Headers: {response.headers.get('Access-Control-Allow-Headers')}")
        
        assert response.status_code in [200, 204]
        assert response.headers.get("Access-Control-Allow-Origin") == "*" or response.headers.get("Access-Control-Allow-Origin") == "http://example.com"
        print("✅ CORS configuration test passed")
        return True
    except Exception as e:
        print(f"❌ CORS configuration test failed: {str(e)}")
        return False

def run_all_tests():
    """Run all tests and return a summary"""
    print("\n=== Starting Backend API Tests ===")
    print(f"Backend URL: {BACKEND_URL}")
    
    results = {
        "root_endpoint": test_root_endpoint(),
        "create_status_check": bool(test_create_status_check()),
        "get_status_checks": test_get_status_checks(),
        "database_connectivity": test_database_connectivity(),
        "cors_configuration": test_cors_configuration()
    }
    
    print("\n=== Test Summary ===")
    for test_name, result in results.items():
        status = "✅ PASSED" if result else "❌ FAILED"
        print(f"{test_name}: {status}")
    
    all_passed = all(results.values())
    print(f"\nOverall Result: {'✅ ALL TESTS PASSED' if all_passed else '❌ SOME TESTS FAILED'}")
    return all_passed

if __name__ == "__main__":
    run_all_tests()