> IMPORTANT: IGNORE THIS FILE

### Future Ideal state 
#### Mental Model
- The public app is a storefront.
- The dashboard is the back office.
- The database/API is the shared order book.
They do not need to call each other directly. They both work with the same order system.
### Likely Future Architecture
1. farmaciaduret.online
  Public app
  - catalog
  - checkout
  - order form
  - customer-facing flow
2. dashboard.farmaciaduret.online
  Dashboard app
  - staff auth
  - order queue
  - fulfillment
  - transitions
  - audit
3. Shared backend/data
  - Postgres
  - R2
  - payment provider
  - CMS
  - WhatsApp integration




 <!-- suggestions from experts to help ai -->
 1. tables/schema sctructure
 2. routes 
 3. validation enforcement / lib -> bussiness rules
 4. UI component lib & design tokens
 5. folder structure / where things live
 6. Choosing how your client and server communicate -- API rest graphql
