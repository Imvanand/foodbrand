-- This script will delete all existing orders and order items from your database.
-- It will also remove the guest addresses created during dummy checkouts.

-- 1. Delete all order items (dependent on orders)
DELETE FROM public.order_items;

-- 2. Delete all orders
DELETE FROM public.orders;

-- 3. Delete guest checkout dummy addresses (optional, keeps real user addresses safe)
DELETE FROM public.user_addresses WHERE area_street = 'Guest Checkout';
