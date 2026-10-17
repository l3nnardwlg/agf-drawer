import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import {
  inviteMemberSchema,
  updateMemberRoleSchema,
  transferOwnershipSchema,
  acceptInvitationSchema,
} from './schemas.js';
import * as memberService from './service.js';
import {
  requireAuth,
  requirePermission,
  resolveWorkspace,
} from '../../middleware/auth.js';

export const memberRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  app.addHook('preHandler', requireAuth);

  // Accept an invitation (no workspace context required since it's in the invitation token)
  app.post('/invitations/accept', async (request, reply) => {
    const input = acceptInvitationSchema.parse(request.body);
    const result = await memberService.acceptInvitation(input.token, request.user!.id);
    return reply.send({
      message: 'Invitation accepted successfully',
      ...result,
    });
  });

  // Workspace-scoped member routes
  app.register(async (scoped) => {
    scoped.addHook('preHandler', resolveWorkspace);

    // List members
    scoped.get(
      '/workspaces/:workspaceId/members',
      { preHandler: [requirePermission('members.read')] },
      async (request, reply) => {
        const { workspaceId } = request.params as { workspaceId: string };
        const members = await memberService.listMembers(workspaceId);
        return reply.send(members);
      }
    );

    // Update member role
    scoped.patch(
      '/workspaces/:workspaceId/members/:memberId',
      { preHandler: [requirePermission('members.manage')] },
      async (request, reply) => {
        const { workspaceId, memberId } = request.params as {
          workspaceId: string;
          memberId: string;
        };
        const input = updateMemberRoleSchema.parse(request.body);
        const updated = await memberService.updateMemberRole(
          workspaceId,
          memberId,
          input.role,
          request.user!.id
        );
        return reply.send(updated);
      }
    );

    // Remove member
    scoped.delete(
      '/workspaces/:workspaceId/members/:memberId',
      { preHandler: [requirePermission('members.manage')] },
      async (request, reply) => {
        const { workspaceId, memberId } = request.params as {
          workspaceId: string;
          memberId: string;
        };
        await memberService.removeMember(workspaceId, memberId, request.user!.id);
        return reply.send({ message: 'Member removed successfully' });
      }
    );

    // Leave workspace
    scoped.post(
      '/workspaces/:workspaceId/leave',
      async (request, reply) => {
        const { workspaceId } = request.params as { workspaceId: string };
        await memberService.leaveWorkspace(workspaceId, request.user!.id);
        return reply.send({ message: 'Left workspace successfully' });
      }
    );

    // Transfer ownership
    scoped.post(
      '/workspaces/:workspaceId/transfer-ownership',
      async (request, reply) => {
        const { workspaceId } = request.params as { workspaceId: string };
        const input = transferOwnershipSchema.parse(request.body);
        await memberService.transferOwnership(
          workspaceId,
          request.user!.id,
          input.newOwnerUserId
        );
        return reply.send({ message: 'Workspace ownership transferred successfully' });
      }
    );

    // List invitations
    scoped.get(
      '/workspaces/:workspaceId/invitations',
      { preHandler: [requirePermission('members.read')] },
      async (request, reply) => {
        const { workspaceId } = request.params as { workspaceId: string };
        const invitations = await memberService.listInvitations(workspaceId);
        return reply.send(invitations);
      }
    );

    // Create invitation
    scoped.post(
      '/workspaces/:workspaceId/invitations',
      { preHandler: [requirePermission('members.invite')] },
      async (request, reply) => {
        const { workspaceId } = request.params as { workspaceId: string };
        const input = inviteMemberSchema.parse(request.body);
        const invitation = await memberService.createInvitation(
          workspaceId,
          input.email,
          input.role,
          request.user!.id
        );
        return reply.status(201).send(invitation);
      }
    );

    // Revoke invitation
    scoped.delete(
      '/workspaces/:workspaceId/invitations/:invitationId',
      { preHandler: [requirePermission('members.manage')] },
      async (request, reply) => {
        const { workspaceId, invitationId } = request.params as {
          workspaceId: string;
          invitationId: string;
        };
        await memberService.revokeInvitation(workspaceId, invitationId);
        return reply.send({ message: 'Invitation revoked successfully' });
      }
    );
  });
};
