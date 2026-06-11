import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://qwznevdakjcylosajrxj.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3em5ldmRha2pjeWxvc2FqcnhqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDYwNTgyNSwiZXhwIjoyMDk2MTgxODI1fQ.HmsK197HWKsObXzD9WoEkPTjnYRBp_zPw5sXr7dZM-c"
);

async function main() {
  console.log("Adding cover_image column to categories table...");

  // Use rpc to execute raw SQL
  const { data, error } = await supabase.rpc("exec_sql", {
    query: "ALTER TABLE categories ADD COLUMN IF NOT EXISTS cover_image TEXT;"
  });

  if (error) {
    // If rpc doesn't exist, try a different approach - just test the column
    console.log("RPC not available, testing column directly...");
    
    const { data: testData, error: testError } = await supabase
      .from("categories")
      .select("id, cover_image")
      .limit(1);

    if (testError && testError.message.includes("cover_image")) {
      console.log("\n❌ Column 'cover_image' does NOT exist yet.");
      console.log("The column needs to be added. Trying via REST API...");
      
      // Try using the Supabase REST endpoint directly with SQL
      const res = await fetch("https://qwznevdakjcylosajrxj.supabase.co/rest/v1/rpc/exec_sql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3em5ldmRha2pjeWxvc2FqcnhqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDYwNTgyNSwiZXhwIjoyMDk2MTgxODI1fQ.HmsK197HWKsObXzD9WoEkPTjnYRBp_zPw5sXr7dZM-c",
          "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3em5ldmRha2pjeWxvc2FqcnhqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDYwNTgyNSwiZXhwIjoyMDk2MTgxODI1fQ.HmsK197HWKsObXzD9WoEkPTjnYRBp_zPw5sXr7dZM-c",
        },
        body: JSON.stringify({ query: "ALTER TABLE categories ADD COLUMN IF NOT EXISTS cover_image TEXT;" }),
      });
      
      if (res.ok) {
        console.log("✅ Column added successfully via REST!");
      } else {
        console.log("REST approach also failed. Using Supabase Management API...");
        
        // Last resort: Use the database endpoint directly
        const dbRes = await fetch("https://qwznevdakjcylosajrxj.supabase.co/pg", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3em5ldmRha2pjeWxvc2FqcnhqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDYwNTgyNSwiZXhwIjoyMDk2MTgxODI1fQ.HmsK197HWKsObXzD9WoEkPTjnYRBp_zPw5sXr7dZM-c",
          },
          body: JSON.stringify({ query: "ALTER TABLE categories ADD COLUMN IF NOT EXISTS cover_image TEXT;" }),
        });
        
        if (dbRes.ok) {
          console.log("✅ Column added via DB endpoint!");
        } else {
          console.log("\n⚠️  MANUAL STEP REQUIRED:");
          console.log("Please run this SQL in Supabase Dashboard:");
          console.log("ALTER TABLE categories ADD COLUMN IF NOT EXISTS cover_image TEXT;");
          console.log("\nURL: https://supabase.com/dashboard/project/qwznevdakjcylosajrxj/sql/new");
        }
      }
    } else if (testError) {
      console.log("Unexpected error:", testError.message);
    } else {
      console.log("✅ Column 'cover_image' already exists! Current data:", testData);
    }
  } else {
    console.log("✅ SQL executed successfully:", data);
  }
}

main().catch(console.error);
