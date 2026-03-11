
import { Component, ChangeDetectionStrategy, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { User } from '../../../models/user.model';
import { Group } from '../../../models/group.model';
import { LoadingService } from '../../../services/loading.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-management.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserManagementComponent implements OnInit {
  private adminService = inject(AdminService);
  private loadingService = inject(LoadingService);
  private fb = inject(FormBuilder);
  
  users = signal<User[]>([]);
  groups = signal<Group[]>([]);
  isLoading = this.loadingService.isLoading;
  
  editingUser = signal<User | null>(null);
  
  reassignForm = this.fb.group({
    groupId: [''],
  });

  async ngOnInit() {
    await this.loadData();
  }
  
  async loadData() {
     // The loading service will be activated by the service calls
    const [userList, groupList] = await Promise.all([
      this.adminService.getUsers(),
      this.adminService.getGroups()
    ]);
    this.users.set(userList);
    this.groups.set(groupList);
  }

  getGroupName(groupId: number): string {
    return this.groups().find(g => g.id === groupId)?.name || 'N/A';
  }

  async onToggleStatus(user: User) {
    const newStatus = user.status === 'ENABLED' ? 'DISABLED' : 'ENABLED';
    await this.adminService.updateUserStatus(user.id, newStatus);
    const updatedUsers = await this.adminService.getUsers();
    this.users.set(updatedUsers);
  }

  openReassignModal(user: User) {
    this.editingUser.set(user);
    this.reassignForm.patchValue({ groupId: user.groupId.toString() });
  }

  closeReassignModal() {
    this.editingUser.set(null);
  }
  
  async onReassignGroup() {
    const user = this.editingUser();
    if (!user || this.reassignForm.invalid) {
      return;
    }
    const newGroupId = parseInt(this.reassignForm.value.groupId!, 10);
    await this.adminService.reassignUserGroup(user.id, newGroupId);
    const updatedUsers = await this.adminService.getUsers();
    this.users.set(updatedUsers);
    this.closeReassignModal();
  }
}
