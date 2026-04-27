#!/usr/bin/env python3
"""Pull public Instagram profile data for member handles via Instagram's web API."""
# /// script
# dependencies = ["requests"]
# ///

import csv
import json
import time
import sys
import requests

CSV_IN = "docs/memberemailsandinstagrams.csv"
JSON_OUT = "docs/instagram-data.json"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "X-IG-App-ID": "936619743392459",
}
API_URL = "https://www.instagram.com/api/v1/users/web_profile_info/"

def parse_handles(cell: str) -> list[str]:
    if not cell:
        return []
    handles = []
    for part in cell.replace(";", ",").split(","):
        h = part.strip().lstrip("@").strip()
        if h:
            handles.append(h)
    return handles

def pull_profile(session: requests.Session, username: str) -> dict | None:
    try:
        resp = session.get(API_URL, params={"username": username}, headers=HEADERS, timeout=10)
        if resp.status_code == 404:
            print(f"  SKIP: @{username} not found (404)")
            return None
        if resp.status_code != 200:
            print(f"  ERROR: @{username} HTTP {resp.status_code}")
            return None

        raw = resp.json()
        u = raw.get("data", {}).get("user")
        if not u:
            print(f"  SKIP: @{username} no user data in response")
            return None

        data = {
            "username": u.get("username"),
            "full_name": u.get("full_name"),
            "biography": u.get("biography"),
            "followers": u.get("edge_followed_by", {}).get("count", 0),
            "following": u.get("edge_follow", {}).get("count", 0),
            "posts_count": u.get("edge_owner_to_timeline_media", {}).get("count", 0),
            "is_verified": u.get("is_verified", False),
            "is_private": u.get("is_private", False),
            "is_business": u.get("is_business_account", False),
            "business_category": u.get("category_name"),
            "external_url": u.get("external_url"),
            "profile_pic_url": u.get("profile_pic_url_hd") or u.get("profile_pic_url"),
        }

        posts = []
        edges = u.get("edge_owner_to_timeline_media", {}).get("edges", [])
        for e in edges[:3]:
            p = e["node"]
            cap_edges = p.get("edge_media_to_caption", {}).get("edges", [])
            caption = cap_edges[0]["node"]["text"] if cap_edges else ""
            post_data = {
                "shortcode": p.get("shortcode"),
                "caption": caption[:200],
                "likes": p.get("edge_media_preview_like", {}).get("count", 0),
                "comments": p.get("edge_media_to_comment", {}).get("count", 0),
                "timestamp": p.get("taken_at_timestamp"),
                "is_video": p.get("is_video", False),
            }
            if p.get("is_video"):
                post_data["video_view_count"] = p.get("video_view_count")
            posts.append(post_data)
        data["recent_posts"] = posts

        return data
    except Exception as e:
        print(f"  ERROR: @{username}: {e}")
        return None

def main():
    smoke_test = "--smoke" in sys.argv

    session = requests.Session()

    members = []
    with open(CSV_IN) as f:
        reader = csv.DictReader(f)
        for row in reader:
            members.append(row)

    all_handles = []
    seen = set()
    for m in members:
        for h in parse_handles(m.get("Personal Instagrams", "")) + parse_handles(m.get("Business Instagrams", "")):
            if h not in seen:
                all_handles.append(h)
                seen.add(h)

    if smoke_test:
        test_handles = all_handles[:3]
        print(f"SMOKE TEST: pulling {len(test_handles)} of {len(all_handles)} handles")
        target_handles = set(test_handles)
    else:
        print(f"Pulling all {len(all_handles)} handles across {len(members)} members")
        target_handles = seen

    profiles = {}
    handle_list = sorted(target_handles)
    for i, handle in enumerate(handle_list):
        print(f"[{i+1}/{len(handle_list)}] Pulling @{handle}...")
        data = pull_profile(session, handle)
        if data:
            profiles[handle] = data
            print(f"  OK: {data['followers']:,} followers, {data['posts_count']:,} posts, verified={data['is_verified']}")
        if i < len(handle_list) - 1:
            time.sleep(4)

    results = []
    for m in members:
        personal = parse_handles(m.get("Personal Instagrams", ""))
        business = parse_handles(m.get("Business Instagrams", ""))
        entry = {
            "name": m["Name"],
            "email": m["Email"],
            "personal_accounts": [profiles[h] for h in personal if h in profiles],
            "business_accounts": [profiles[h] for h in business if h in profiles],
        }
        results.append(entry)

    output = {
        "pulled_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "total_handles": len(all_handles),
        "attempted": len(handle_list),
        "successful_pulls": len(profiles),
        "members": results,
    }

    with open(JSON_OUT, "w") as f:
        json.dump(output, f, indent=2)

    print(f"\nDone! {len(profiles)}/{len(handle_list)} profiles pulled.")
    print(f"Saved to {JSON_OUT}")

if __name__ == "__main__":
    main()
