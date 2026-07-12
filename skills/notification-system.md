# Notification System

## Purpose

Deliver timely, contextual notifications to users about ESG events. Supports in-app notifications and email notifications.

---

## Notification Events

The following events trigger notifications. These are **mandatory** per the specification.

| Event                     | Recipients                          | Priority |
| ------------------------- | ----------------------------------- | -------- |
| Compliance Issue Raised   | Issue owner, department head, admins | High     |
| Compliance Issue Overdue  | Issue owner, department head, admins | Critical |
| CSR Participation Approved | The participating employee          | Normal   |
| CSR Participation Rejected | The participating employee          | Normal   |
| Challenge Approved        | The participating employee           | Normal   |
| Challenge Rejected        | The participating employee           | Normal   |
| Badge Earned              | The employee who earned it           | Normal   |
| Policy Acknowledgement Reminder | Employees with pending acknowledgements | Normal |
| Reward Redeemed           | The redeeming employee               | Low      |

---

## Notification Channels

### In-App Notifications

- Stored in the `notifications` table.
- Displayed via a bell icon in the header with unread count badge.
- Dropdown panel shows recent notifications.
- Click on notification navigates to the relevant page (using `link` field).
- "Mark as read" and "Mark all as read" actions.

### Email Notifications

- Sent via SMTP (configured in `.env`).
- Uses HTML email templates.
- Sent asynchronously (background task or queue).
- Can be disabled per notification type in Settings.

### Future: Push Notifications

- WebSocket or Server-Sent Events for real-time in-app delivery.
- Browser push notifications via Web Push API.

---

## Notification Model

```python
class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    type = Column(Enum("compliance", "challenge", "badge", "policy", "reward", "system"))
    is_read = Column(Boolean, default=False)
    link = Column(String(500), nullable=True)  # Deep link to relevant page
    created_at = Column(DateTime, server_default=func.now())
```

---

## Notification Service

```python
class NotificationService:
    def send(
        self,
        db: Session,
        user_id: int,
        title: str,
        message: str,
        notification_type: str,
        link: str | None = None,
        send_email: bool = True,
    ):
        # 1. Check if in-app notifications are enabled
        settings = get_settings(db)
        if settings.in_app_notifications:
            create_notification(db, user_id, title, message, notification_type, link)

        # 2. Check if email notifications are enabled
        if send_email and settings.email_notifications:
            user = get_user(db, user_id)
            send_email_async(user.email, title, message)

    def send_to_many(self, db, user_ids, title, message, notification_type, link=None):
        for user_id in user_ids:
            self.send(db, user_id, title, message, notification_type, link)

    def get_unread_count(self, db, user_id) -> int:
        return db.query(Notification).filter(
            Notification.user_id == user_id,
            Notification.is_read == False,
        ).count()

    def mark_as_read(self, db, notification_id, user_id):
        notification = db.query(Notification).filter(
            Notification.id == notification_id,
            Notification.user_id == user_id,
        ).first()
        if notification:
            notification.is_read = True
            db.commit()

    def mark_all_read(self, db, user_id):
        db.query(Notification).filter(
            Notification.user_id == user_id,
            Notification.is_read == False,
        ).update({"is_read": True})
        db.commit()
```

---

## Notification Templates

| Event                  | Title                         | Message Template                                |
| ---------------------- | ----------------------------- | ----------------------------------------------- |
| Compliance Issue       | "⚠️ New Compliance Issue"     | "A {severity} compliance issue '{title}' has been assigned to you. Due: {due_date}" |
| Issue Overdue          | "🚨 Overdue Compliance Issue" | "Issue '{title}' is overdue since {due_date}. Please resolve immediately." |
| CSR Approved           | "✅ Participation Approved"   | "Your participation in '{activity_title}' was approved. You earned {xp} XP!" |
| CSR Rejected           | "❌ Participation Rejected"   | "Your participation in '{activity_title}' was not approved." |
| Challenge Approved     | "✅ Challenge Completed"      | "Your '{challenge_title}' submission was approved. You earned {xp} XP!" |
| Challenge Rejected     | "❌ Challenge Not Approved"   | "Your '{challenge_title}' submission needs revision." |
| Badge Earned           | "🏆 Badge Unlocked!"          | "Congratulations! You earned the '{badge_name}' badge!" |
| Policy Reminder        | "📋 Policy Acknowledgement"   | "Please acknowledge the policy: '{policy_title}'" |
| Reward Redeemed        | "🎁 Reward Redeemed"          | "You redeemed '{reward_name}' for {points} points." |

---

## Overdue Issue Detection

A scheduled background task (cron job) runs daily to detect overdue compliance issues:

```python
# Scheduled task - runs daily
def check_overdue_issues(db: Session):
    overdue_issues = db.query(ComplianceIssue).filter(
        ComplianceIssue.due_date < date.today(),
        ComplianceIssue.status != "resolved",
        ComplianceIssue.is_overdue == False,  # Not yet flagged
    ).all()

    for issue in overdue_issues:
        issue.is_overdue = True
        # Notify owner
        notification_service.send(db, issue.owner_id, ...)
        # Notify department head
        dept = get_department(db, issue.audit.department_id)
        if dept.head_id:
            notification_service.send(db, dept.head_id, ...)
        # Notify admins
        admins = get_admins(db)
        for admin in admins:
            notification_service.send(db, admin.id, ...)

    db.commit()
```

---

## Settings Configuration

Configurable via Settings → Notification Settings:

| Setting               | Type    | Default | Description                     |
| --------------------- | ------- | ------- | ------------------------------- |
| email_notifications   | Boolean | true    | Enable/disable email sending    |
| in_app_notifications  | Boolean | true    | Enable/disable in-app notifications |

---

## Frontend Components

| Component              | Purpose                              |
| ---------------------- | ------------------------------------ |
| NotificationBell       | Header icon with unread count badge  |
| NotificationDropdown   | Panel showing recent notifications   |
| NotificationItem       | Single notification row              |
| NotificationPage       | Full page view of all notifications  |

---

## API Endpoints

| Method | Path                            | Description           |
| ------ | ------------------------------- | --------------------- |
| GET    | `/notifications`                | List user notifications |
| PATCH  | `/notifications/{id}/read`      | Mark as read          |
| PATCH  | `/notifications/read-all`       | Mark all as read      |
| GET    | `/notifications/unread-count`   | Get unread count      |
