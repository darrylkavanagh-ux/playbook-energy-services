#!/bin/bash
# Automated script to replace Foxlite references in comments

echo "🧹 Cleaning up Foxlite references in comments..."

# Files with comment-only references (safe to batch update)
FILES=(
  "server/src/config/database.ts"
  "server/src/config/emailMigration.ts"
  "server/src/engines/CCLExemptionChecker.ts"
  "server/src/engines/CapacityChargeValidator.ts"
  "server/src/middleware/security.ts"
  "server/src/integrations/DataExtractionOrchestrator.ts"
  "server/src/routes/veritech.ts"
  "server/src/services/EmailBillProcessor.ts"
  "server/src/veritech/VeriTech10CertificateGenerator.ts"
  "server/src/veritech/VeriTech10HybridCertificateGenerator.ts"
  "server/src/neural/NeuralNetworkOrchestrator.ts"
)

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "  Cleaning: $file"
    # Replace Foxlite variations in comments
    sed -i 's/Foxlite/Client/g' "$file"
    sed -i 's/FOXLITE/CLIENT/g' "$file"
    sed -i 's/foxlite/client/g' "$file"
  else
    echo "  ⚠️  File not found: $file"
  fi
done

echo "✅ Comment cleanup complete!"
