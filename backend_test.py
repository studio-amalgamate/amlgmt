#!/usr/bin/env python3
"""
Photography Portfolio Backend API Test Suite
Tests all backend endpoints with proper authentication flow
"""

import requests
import json
import sys
import os
from datetime import datetime

# Get backend URL from frontend .env file
def get_backend_url():
    try:
        with open('/app/frontend/.env', 'r') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    return line.split('=', 1)[1].strip()
    except FileNotFoundError:
        pass
    return "http://localhost:8001"

BASE_URL = get_backend_url()
API_URL = f"{BASE_URL}/api"

class TestResults:
    def __init__(self):
        self.passed = 0
        self.failed = 0
        self.errors = []
        
    def log_pass(self, test_name):
        print(f"✅ PASS: {test_name}")
        self.passed += 1
        
    def log_fail(self, test_name, error):
        print(f"❌ FAIL: {test_name} - {error}")
        self.failed += 1
        self.errors.append(f"{test_name}: {error}")
        
    def summary(self):
        total = self.passed + self.failed
        print(f"\n{'='*60}")
        print(f"TEST SUMMARY: {self.passed}/{total} tests passed")
        if self.errors:
            print(f"\nFAILED TESTS:")
            for error in self.errors:
                print(f"  - {error}")
        print(f"{'='*60}")
        return len(self.errors) == 0

def test_health_check(results):
    """Test 1: Health Check"""
    try:
        response = requests.get(f"{API_URL}/health", timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data.get("status") == "healthy":
                results.log_pass("Health Check")
                return True
            else:
                results.log_fail("Health Check", f"Unexpected response: {data}")
        else:
            results.log_fail("Health Check", f"Status code: {response.status_code}")
    except Exception as e:
        results.log_fail("Health Check", f"Connection error: {str(e)}")
    return False

def test_user_registration(results):
    """Test 2: User Registration"""
    try:
        # Test first user registration (should succeed)
        user_data = {
            "username": "admin",
            "password": "admin123"
        }
        
        response = requests.post(f"{API_URL}/auth/register", json=user_data, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if "message" in data and "user" in data:
                results.log_pass("User Registration - First User")
                
                # Test second user registration (should fail)
                second_user = {
                    "username": "user2",
                    "password": "password123"
                }
                
                response2 = requests.post(f"{API_URL}/auth/register", json=second_user, timeout=10)
                if response2.status_code == 403:
                    results.log_pass("User Registration - Second User Blocked")
                    return True
                else:
                    results.log_fail("User Registration - Second User Blocked", 
                                   f"Expected 403, got {response2.status_code}")
            else:
                results.log_fail("User Registration - First User", f"Invalid response format: {data}")
        else:
            # If registration fails, it might be because user already exists
            if response.status_code == 403:
                results.log_pass("User Registration - Already Exists (Expected)")
                return True
            else:
                results.log_fail("User Registration - First User", 
                               f"Status code: {response.status_code}, Response: {response.text}")
    except Exception as e:
        results.log_fail("User Registration", f"Error: {str(e)}")
    return False

def test_user_login(results):
    """Test 3: User Login"""
    try:
        login_data = {
            "username": "admin",
            "password": "admin123"
        }
        
        response = requests.post(f"{API_URL}/auth/login", json=login_data, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if "access_token" in data and "user" in data:
                results.log_pass("User Login")
                return data["access_token"]
            else:
                results.log_fail("User Login", f"Invalid response format: {data}")
        else:
            results.log_fail("User Login", f"Status code: {response.status_code}, Response: {response.text}")
    except Exception as e:
        results.log_fail("User Login", f"Error: {str(e)}")
    return None

def test_create_project(results, token):
    """Test 4: Create Project"""
    if not token:
        results.log_fail("Create Project", "No authentication token available")
        return None
        
    try:
        headers = {"Authorization": f"Bearer {token}"}
        project_data = {
            "title": "Test Photography Project",
            "client": "Test Client Studio",
            "date": "January 2025",
            "location": "Mumbai, India",
            "description": "A comprehensive test project for the photography portfolio showcasing various techniques and styles.",
            "featured": True
        }
        
        response = requests.post(f"{API_URL}/projects", json=project_data, headers=headers, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if "id" in data and data["title"] == project_data["title"]:
                results.log_pass("Create Project")
                return data["id"]
            else:
                results.log_fail("Create Project", f"Invalid response format: {data}")
        else:
            results.log_fail("Create Project", f"Status code: {response.status_code}, Response: {response.text}")
    except Exception as e:
        results.log_fail("Create Project", f"Error: {str(e)}")
    return None

def test_get_all_projects(results):
    """Test 5: Get All Projects"""
    try:
        response = requests.get(f"{API_URL}/projects", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                results.log_pass("Get All Projects")
                return True
            else:
                results.log_fail("Get All Projects", f"Expected list, got: {type(data)}")
        else:
            results.log_fail("Get All Projects", f"Status code: {response.status_code}")
    except Exception as e:
        results.log_fail("Get All Projects", f"Error: {str(e)}")
    return False

def test_get_single_project(results, project_id):
    """Test 6: Get Single Project"""
    if not project_id:
        results.log_fail("Get Single Project", "No project ID available")
        return False
        
    try:
        response = requests.get(f"{API_URL}/projects/{project_id}", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if "id" in data and data["id"] == project_id:
                results.log_pass("Get Single Project")
                return True
            else:
                results.log_fail("Get Single Project", f"Project ID mismatch: {data}")
        else:
            results.log_fail("Get Single Project", f"Status code: {response.status_code}")
    except Exception as e:
        results.log_fail("Get Single Project", f"Error: {str(e)}")
    return False

def test_get_featured_images(results):
    """Test 7: Get Featured Images"""
    try:
        response = requests.get(f"{API_URL}/featured", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                results.log_pass("Get Featured Images")
                return True
            else:
                results.log_fail("Get Featured Images", f"Expected list, got: {type(data)}")
        else:
            results.log_fail("Get Featured Images", f"Status code: {response.status_code}")
    except Exception as e:
        results.log_fail("Get Featured Images", f"Error: {str(e)}")
    return False

def test_update_project(results, token, project_id):
    """Test 8: Update Project"""
    if not token:
        results.log_fail("Update Project", "No authentication token available")
        return False
    if not project_id:
        results.log_fail("Update Project", "No project ID available")
        return False
        
    try:
        headers = {"Authorization": f"Bearer {token}"}
        update_data = {
            "title": "Updated Photography Project",
            "featured": False
        }
        
        response = requests.put(f"{API_URL}/projects/{project_id}", json=update_data, headers=headers, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data["title"] == update_data["title"] and data["featured"] == update_data["featured"]:
                results.log_pass("Update Project")
                return True
            else:
                results.log_fail("Update Project", f"Update not reflected: {data}")
        else:
            results.log_fail("Update Project", f"Status code: {response.status_code}, Response: {response.text}")
    except Exception as e:
        results.log_fail("Update Project", f"Error: {str(e)}")
    return False

def test_delete_project(results, token, project_id):
    """Test 9: Delete Project"""
    if not token:
        results.log_fail("Delete Project", "No authentication token available")
        return False
    if not project_id:
        results.log_fail("Delete Project", "No project ID available")
        return False
        
    try:
        headers = {"Authorization": f"Bearer {token}"}
        
        response = requests.delete(f"{API_URL}/projects/{project_id}", headers=headers, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if "message" in data:
                results.log_pass("Delete Project")
                return True
            else:
                results.log_fail("Delete Project", f"Invalid response format: {data}")
        else:
            results.log_fail("Delete Project", f"Status code: {response.status_code}, Response: {response.text}")
    except Exception as e:
        results.log_fail("Delete Project", f"Error: {str(e)}")
    return False

def test_protected_routes_without_auth(results):
    """Test 10: Protected Routes Without Authentication"""
    try:
        # Test create project without token
        project_data = {"title": "Unauthorized Test"}
        response = requests.post(f"{API_URL}/projects", json=project_data, timeout=10)
        
        if response.status_code == 403:
            results.log_pass("Protected Route - Create Project (No Auth)")
        else:
            results.log_fail("Protected Route - Create Project (No Auth)", 
                           f"Expected 403, got {response.status_code}")
            
        # Test update project without token
        response2 = requests.put(f"{API_URL}/projects/test-id", json={"title": "Test"}, timeout=10)
        
        if response2.status_code == 403:
            results.log_pass("Protected Route - Update Project (No Auth)")
        else:
            results.log_fail("Protected Route - Update Project (No Auth)", 
                           f"Expected 403, got {response2.status_code}")
            
        # Test delete project without token
        response3 = requests.delete(f"{API_URL}/projects/test-id", timeout=10)
        
        if response3.status_code == 403:
            results.log_pass("Protected Route - Delete Project (No Auth)")
            return True
        else:
            results.log_fail("Protected Route - Delete Project (No Auth)", 
                           f"Expected 403, got {response3.status_code}")
    except Exception as e:
        results.log_fail("Protected Routes Without Auth", f"Error: {str(e)}")
    return False

def test_get_admin_projects(results, token):
    """Test 11: Get Admin Projects"""
    if not token:
        results.log_fail("Get Admin Projects", "No authentication token available")
        return None
        
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(f"{API_URL}/admin/projects", headers=headers, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                results.log_pass("Get Admin Projects")
                return data
            else:
                results.log_fail("Get Admin Projects", f"Expected list, got: {type(data)}")
        else:
            results.log_fail("Get Admin Projects", f"Status code: {response.status_code}, Response: {response.text}")
    except Exception as e:
        results.log_fail("Get Admin Projects", f"Error: {str(e)}")
    return None

def test_reorder_projects(results, token):
    """Test 12: Reorder Projects"""
    if not token:
        results.log_fail("Reorder Projects", "No authentication token available")
        return False
        
    try:
        headers = {"Authorization": f"Bearer {token}"}
        
        # Step 1: Get current list of projects from admin endpoint
        response = requests.get(f"{API_URL}/admin/projects", headers=headers, timeout=10)
        if response.status_code != 200:
            results.log_fail("Reorder Projects - Get Projects", f"Status code: {response.status_code}")
            return False
            
        projects = response.json()
        if len(projects) < 3:
            results.log_fail("Reorder Projects", f"Need at least 3 projects, found {len(projects)}")
            return False
        
        # Step 2: Take first 3 projects and reverse their order
        first_three = projects[:3]
        original_order = [p['id'] for p in first_three]
        print(f"  Original order of first 3 projects: {original_order}")
        
        # Create reorder payload - swap first and third
        reorder_payload = {
            "project_order": [
                {"id": first_three[2]['id'], "order": 0},  # Third becomes first
                {"id": first_three[1]['id'], "order": 1},  # Second stays second
                {"id": first_three[0]['id'], "order": 2}   # First becomes third
            ]
        }
        
        # Step 3: Send PUT request to reorder endpoint
        response = requests.put(f"{API_URL}/projects/reorder", json=reorder_payload, headers=headers, timeout=10)
        
        if response.status_code != 200:
            results.log_fail("Reorder Projects - PUT Request", f"Status code: {response.status_code}, Response: {response.text}")
            return False
        
        # Step 4: Verify response returns all projects
        reorder_response = response.json()
        if not isinstance(reorder_response, list):
            results.log_fail("Reorder Projects - Response Format", f"Expected list, got: {type(reorder_response)}")
            return False
        
        # Step 5: Fetch projects from public endpoint
        response = requests.get(f"{API_URL}/projects", timeout=10)
        if response.status_code != 200:
            results.log_fail("Reorder Projects - Get Public Projects", f"Status code: {response.status_code}")
            return False
        
        public_projects = response.json()
        
        # Step 6: Verify the order has changed
        new_order = [p['id'] for p in public_projects[:3]]
        expected_order = [first_three[2]['id'], first_three[1]['id'], first_three[0]['id']]
        
        print(f"  Expected order: {expected_order}")
        print(f"  New order: {new_order}")
        
        if new_order == expected_order:
            results.log_pass("Reorder Projects - Order Changed")
            return True
        else:
            results.log_fail("Reorder Projects - Order Verification", 
                           f"Expected {expected_order}, got {new_order}")
            return False
            
    except Exception as e:
        results.log_fail("Reorder Projects", f"Error: {str(e)}")
    return False

def test_order_persistence(results, token):
    """Test 13: Order Persistence"""
    if not token:
        results.log_fail("Order Persistence", "No authentication token available")
        return False
        
    try:
        import time
        
        headers = {"Authorization": f"Bearer {token}"}
        
        # Get current order from admin endpoint
        response1 = requests.get(f"{API_URL}/admin/projects", headers=headers, timeout=10)
        if response1.status_code != 200:
            results.log_fail("Order Persistence - First Fetch", f"Status code: {response1.status_code}")
            return False
        
        projects1 = response1.json()
        order1 = [p['id'] for p in projects1[:3]]
        
        # Wait a few seconds
        print("  Waiting 3 seconds to test persistence...")
        time.sleep(3)
        
        # Fetch again from public endpoint
        response2 = requests.get(f"{API_URL}/projects", timeout=10)
        if response2.status_code != 200:
            results.log_fail("Order Persistence - Second Fetch", f"Status code: {response2.status_code}")
            return False
        
        projects2 = response2.json()
        order2 = [p['id'] for p in projects2[:3]]
        
        print(f"  First fetch order: {order1}")
        print(f"  Second fetch order: {order2}")
        
        if order1 == order2:
            results.log_pass("Order Persistence - Order Maintained")
            return True
        else:
            results.log_fail("Order Persistence", f"Order changed: {order1} -> {order2}")
            return False
            
    except Exception as e:
        results.log_fail("Order Persistence", f"Error: {str(e)}")
    return False

def main():
    print("🚀 Starting Photography Portfolio Backend API Tests")
    print(f"Backend URL: {BASE_URL}")
    print(f"API URL: {API_URL}")
    print("="*60)
    
    results = TestResults()
    
    # Test 1: Health Check
    if not test_health_check(results):
        print("❌ Backend is not responding. Stopping tests.")
        return False
    
    # Test 2: User Registration
    test_user_registration(results)
    
    # Test 3: User Login
    token = test_user_login(results)
    
    # Test 4: Create Project
    project_id = test_create_project(results, token)
    
    # Test 5: Get All Projects
    test_get_all_projects(results)
    
    # Test 6: Get Single Project
    test_get_single_project(results, project_id)
    
    # Test 7: Get Featured Images
    test_get_featured_images(results)
    
    # Test 8: Update Project
    test_update_project(results, token, project_id)
    
    # Test 9: Delete Project
    test_delete_project(results, token, project_id)
    
    # Test 10: Protected Routes Without Authentication
    test_protected_routes_without_auth(results)
    
    # Test 11: Get Admin Projects
    test_get_admin_projects(results, token)
    
    # Test 12: Reorder Projects
    test_reorder_projects(results, token)
    
    # Test 13: Order Persistence
    test_order_persistence(results, token)
    
    # Final Summary
    success = results.summary()
    return success

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)