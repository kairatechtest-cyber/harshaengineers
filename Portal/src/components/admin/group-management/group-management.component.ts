
import { Component, ChangeDetectionStrategy, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { Group } from '../../../models/group.model';
import { LoadingService } from '../../../services/loading.service';

@Component({
  selector: 'app-group-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './group-management.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupManagementComponent implements OnInit {
  private adminService = inject(AdminService);
  private loadingService = inject(LoadingService);
  private fb = inject(FormBuilder);
  
  groups = signal<Group[]>([]);
  isLoading = this.loadingService.isLoading;
  isSubmitting = this.loadingService.isLoading;

  editingGroup = signal<Group | null>(null);

  groupForm = this.fb.group({
    name: ['', Validators.required],
    domains: ['', Validators.required],
  });

  async ngOnInit() {
    await this.loadGroups();
  }

  async loadGroups() {
    const groupList = await this.adminService.getGroups();
    this.groups.set(groupList);
  }

  editGroup(group: Group) {
    this.editingGroup.set(group);
    this.groupForm.setValue({
      name: group.name,
      domains: group.domains.join(', '),
    });
  }

  cancelEdit() {
    this.editingGroup.set(null);
    this.groupForm.reset();
  }

  async deleteGroup(group: Group) {
    if (confirm(`Are you sure you want to delete the group "${group.name}"?`)) {
      await this.adminService.deleteGroup(group.id);
      await this.loadGroups();
    }
  }

  async onSubmit() {
    if (this.groupForm.invalid) {
      this.groupForm.markAllAsTouched();
      return;
    }

    const formValue = this.groupForm.value;
    const groupData = {
      name: formValue.name!,
      domains: formValue.domains!.split(',').map(d => d.trim()).filter(Boolean),
    };

    if (this.editingGroup()) {
      const updatedGroup = { ...this.editingGroup()!, ...groupData };
      await this.adminService.updateGroup(updatedGroup);
    } else {
      await this.adminService.addGroup(groupData);
    }
    
    this.cancelEdit();
    await this.loadGroups();
  }
}
