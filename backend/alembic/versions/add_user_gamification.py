"""Add gamification fields to users table

Revision ID: add_user_gamification
Revises: 
Create Date: 2025-11-26 11:46:00

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = 'add_user_gamification'
down_revision = None  # Update this if you have previous migrations
branch_labels = None
depends_on = None


def upgrade():
    """Add gamification fields to users table"""
    # Add points column
    op.add_column('users', sa.Column('points', sa.Integer(), nullable=False, server_default='0', comment='User points for contributions and activities'))
    
    # Add coins column
    op.add_column('users', sa.Column('coins', sa.Integer(), nullable=False, server_default='0', comment='Virtual currency for rewards'))
    
    # Add level column
    op.add_column('users', sa.Column('level', sa.Integer(), nullable=False, server_default='1', comment='User level based on XP/points'))
    
    # Add badges column (JSON array)
    op.add_column('users', sa.Column('badges', mysql.JSON(), nullable=False, server_default='[]', comment='Array of earned badges'))


def downgrade():
    """Remove gamification fields from users table"""
    op.drop_column('users', 'badges')
    op.drop_column('users', 'level')
    op.drop_column('users', 'coins')
    op.drop_column('users', 'points')
