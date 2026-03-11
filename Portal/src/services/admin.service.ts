
import { Injectable, signal, inject } from '@angular/core';
import { User } from '../models/user.model';
import { Group } from '../models/group.model';
import { LoadingService } from './loading.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private loadingService = inject(LoadingService);

  private users = signal<User[]>([
    { id: 1, firstName: 'Admin', lastName: 'Kaira', email: 'admin@kaira-technologies.com', username: 'admin', country: 'USA', location: 'New York', phone: '+1234567890', companyName: 'Kaira Technologies', jobTitle: 'Platform Administrator', role: 'ADMIN', status: 'ENABLED', groupId: 3 },
    { id: 2, firstName: 'John', lastName: 'Doe', email: 'john.doe@honda.com', username: 'john.doe', country: 'USA', location: 'Chicago', phone: '+1987654321', companyName: 'Honda', jobTitle: 'Analyst', role: 'USER', status: 'ENABLED', groupId: 1 },
    { id: 3, firstName: 'Peter', lastName: 'Jones', email: 'peter.jones@wipro.com', username: 'peter.jones', country: 'UK', location: 'London', phone: '+442079460958', companyName: 'Wipro', jobTitle: 'Developer', role: 'USER', status: 'DISABLED', groupId: 2 },
  ]);

  private groups = signal<Group[]>([
    { id: 1, name: 'Honda', domains: ['honda.com'] },
    { id: 2, name: 'Wipro', domains: ['wipro.com'] },
    { id: 3, name: 'KT Group', domains: ['kaira-technologies.com'] },
  ]);

  private nextGroupId = 4;

  private async handleLoading<T>(promise: Promise<T>): Promise<T> {
    this.loadingService.show();
    try {
      return await promise;
    } finally {
      this.loadingService.hide();
    }
  }

  // --- User Management ---
  getUsers(): Promise<User[]> {
    return this.handleLoading(new Promise(resolve => setTimeout(() => resolve(this.users()), 500)));
  }

  updateUserStatus(userId: number, status: 'ENABLED' | 'DISABLED'): Promise<User> {
    return this.handleLoading(new Promise((resolve, reject) => {
      setTimeout(() => {
        let updatedUser: User | undefined;
        this.users.update(users => users.map(u => {
          if (u.id === userId) {
            updatedUser = { ...u, status };
            return updatedUser;
          }
          return u;
        }));
        if (updatedUser) resolve(updatedUser);
        else reject(new Error('User not found'));
      }, 300);
    }));
  }

  reassignUserGroup(userId: number, groupId: number): Promise<User> {
    return this.handleLoading(new Promise((resolve, reject) => {
       setTimeout(() => {
        let updatedUser: User | undefined;
        this.users.update(users => users.map(u => {
          if (u.id === userId) {
            updatedUser = { ...u, groupId };
            return updatedUser;
          }
          return u;
        }));
        if (updatedUser) resolve(updatedUser);
        else reject(new Error('User not found'));
      }, 300);
    }));
  }

  // --- Group Management ---
  getGroups(): Promise<Group[]> {
    return this.handleLoading(new Promise(resolve => setTimeout(() => resolve(this.groups()), 500)));
  }

  addGroup(groupData: { name: string; domains: string[] }): Promise<Group> {
    return this.handleLoading(new Promise(resolve => {
       setTimeout(() => {
        const newGroup: Group = { id: this.nextGroupId++, ...groupData };
        this.groups.update(groups => [...groups, newGroup]);
        resolve(newGroup);
      }, 300);
    }));
  }

  updateGroup(updatedGroup: Group): Promise<Group> {
    return this.handleLoading(new Promise((resolve, reject) => {
       setTimeout(() => {
        let found = false;
        this.groups.update(groups => groups.map(g => {
          if (g.id === updatedGroup.id) {
            found = true;
            return updatedGroup;
          }
          return g;
        }));
        if (found) resolve(updatedGroup);
        else reject(new Error('Group not found'));
      }, 300);
    }));
  }

  deleteGroup(groupId: number): Promise<void> {
    return this.handleLoading(new Promise(resolve => {
      setTimeout(() => {
        this.groups.update(groups => groups.filter(g => g.id !== groupId));
        resolve();
      }, 300);
    }));
  }
}
